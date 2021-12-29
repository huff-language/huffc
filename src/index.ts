import { padNBytes, toHex } from "./utils/bytes";
import { compileMacro } from "./compiler/compiler";
import { parseFile, setStoragePointerConstants } from "./parser/high-level";
import { ethers } from "../tests/huff/node_modules/ethers/lib";
import { generateAbi } from "./output";

/**
 * Compile a Huff file.
 * @param filePath The path to the file.
 * @param args An array containing the arguments to the macro.
 * @returns The compiled bytecode.
 */
const compile = (filePath: string, output: string, args: { type: string; value: string }[]) => {
  // Parse the file and generate definitions.
  const { macros, constants, tables, functions, events } = parseFile(filePath);

  // Generate the contract ABI.
  generateAbi(output, functions, events);

  // Set storage pointer constants.
  constants.data = setStoragePointerConstants(["CONSTRUCTOR", "MAIN"], macros.data, constants);

  // Compile the macros.
  const mainBytecode = macros.data["MAIN"]
    ? compileMacro("MAIN", [], macros.data, constants.data, tables.data)
    : "";
  const constructorBytecode = macros.data["CONSTRUCTORS"]
    ? compileMacro("CONSTRUCTOR", [], macros.data, constants.data, tables.data)
    : "";

  // Store the sizes of the bytecode.
  const contractLength = mainBytecode.length / 2;
  const constructorLength = constructorBytecode.length / 2;

  // Convert the sizes and offset to bytes.
  const contractSize = padNBytes(toHex(contractLength), 2);
  const contractCodeOffset = padNBytes(toHex(13 + constructorLength), 2);

  // push2(contract size) dup1 push2(offset to code) push1(0) codecopy push1(0) return
  const bootstrapCode = `61${contractSize}8061${contractCodeOffset}6000396000f3`;
  const constructorCode = `${constructorBytecode}${bootstrapCode}`;
  const deployedBytecode = `${constructorCode}${mainBytecode}`;

  // If there are passed args, encode them.
  encodeArgs(args);

  // Return the bytecode.
  return deployedBytecode;
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
  const abiCoder = new ethers.utils.AbiCoder();
  return abiCoder.encode(types, values).replace(/^(0x)/, "");
}

// Export compiler function as default.
export default compile;
