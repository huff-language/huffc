import { defaultAbiCoder } from "@ethersproject/abi";
import { padNBytes, toHex } from "./utils/bytes";
import { compileMacro } from "./compiler/compiler";
import { parseFile, setStoragePointerConstants } from "./parser/high-level";
import { generateAbi } from "./output";
import { Sources } from "./parser/utils/contents";

/* Compilation Input Type */
type HuffCompilerArgs = {
  filePath: string;
  sources?: Sources;
  generateAbi: boolean;
  constructorArgs?: { type: string; value: string }[];
};

/**
 * Compile a Huff file.
 * @param filePath The path to the file.
 * @param args An array containing the arguments to the macro.
 * @returns The compiled bytecode.
 */
const compile = (args: HuffCompilerArgs) => {
  // Parse the file and generate definitions.
  const { macros, constants, tables, functions, events } = parseFile(args.filePath, args.sources);

  // Generate the contract ABI.
  const abi = args.generateAbi ? generateAbi(functions, events) : "";

  // Set storage pointer constants.
  constants.data = setStoragePointerConstants(["CONSTRUCTOR", "MAIN"], macros.data, constants);

  // Compile the macros.
  const mainBytecode = macros.data["MAIN"]
    ? compileMacro("MAIN", [], macros.data, constants.data, tables.data)
    : "";
  const constructorBytecode = macros.data["CONSTRUCTOR"]
    ? compileMacro("CONSTRUCTOR", [], macros.data, constants.data, tables.data)
    : "";

  // Store the sizes of the bytecode.
  const contractLength = mainBytecode.length / 2;
  const constructorLength = constructorBytecode.length / 2;

  // Bootstrap code variables
  let bootStrapCodeSize = 9;
  let pushContractSizeCode: string;
  let pushContractCodeOffset: string;

  // Compute pushX(contract size)
  if(contractLength < 256) {
    // Convert the size and offset to bytes.
    const contractSize = padNBytes(toHex(contractLength), 1);

    // push1(contract size)
    pushContractSizeCode = `60${contractSize}`
  } else {
    // Increment bootstrap code size
    bootStrapCodeSize++;

    // Convert the size and offset to bytes.
    const contractSize = padNBytes(toHex(contractLength), 2);

    // push2(contract size)
    pushContractSizeCode = `61${contractSize}`
  }

  // Compute pushX(offset to code)
  if((bootStrapCodeSize + constructorLength) < 256) {
    // Convert the size and offset to bytes.
    const contractCodeOffset = padNBytes(toHex(bootStrapCodeSize + constructorLength), 1);

    // push1(offset to code)
    pushContractCodeOffset = `60${contractCodeOffset}`
  } else {
    // Increment bootstrap code size
    bootStrapCodeSize++;

    // Convert the size and offset to bytes.
    const contractCodeOffset = padNBytes(toHex(bootStrapCodeSize + constructorLength), 2);

    // push2(offset to code)
    pushContractCodeOffset = `61${contractCodeOffset}`
  }


  // pushX(contract size) dup1 pushX(offset to code) returndatsize codecopy returndatasize return
  const bootstrapCode = `${pushContractSizeCode}80${pushContractCodeOffset}3d393df3`;
  const constructorCode = `${constructorBytecode}${bootstrapCode}`;
  const deployedBytecode = `${constructorCode}${mainBytecode}${
    args.constructorArgs ? encodeArgs(args.constructorArgs) : ""
  }`;

  // Return the bytecode.
  return { bytecode: deployedBytecode, runtimeBytecode: mainBytecode, abi: abi };
};

/**
 * Encode arguments.
 * @param args The arguments to encode.
 * @returns The encoded arguments.
 */
function encodeArgs(args: { type: string; value: string }[]): string {
  // Instantiate two arrays.
  const types: string[] = [];
  const values: string[] = [];

  // Split the array of arguments into arrays of types and values.
  args.forEach((arg) => {
    types.push(arg.type);
    values.push(arg.value);
  });

  // Encode and array the types and values.
  return defaultAbiCoder.encode(types, values).replace(/^(0x)/, "");
}

// Export compiler function as default.
export default compile;
