import getAllFileContents from "./utils/contents";

import { isEndOfData } from "./utils/regex";
import { Definitions } from "./utils/types";
import { HIGH_LEVEL, MACRO_CODE } from "./syntax/defintions";
import { parseArgs, getLineNumber } from "./utils/parsing";

import { solidityKeccak256, keccak256, arrayify } from "ethers/lib/utils";
import { parseCodeTable, parseJumpTable } from "./tables";
import parseMacro from "./macros";
import { convertBytesToNumber, convertNumberToBytes, findLowest } from "../utils/bytes";

/**
 * Parse a file, storing the definitions of all constants, macros, and tables.
 * @param filePath The path to the file to parse.
 */
export const parseFile = (
  filePath: string
): { macros: Definitions; constants: Definitions; functions: Definitions; tables: Definitions } => {
  // Get an array of file contents.
  const contents: string[] = getAllFileContents(filePath);

  // Set variables.
  const macros: Definitions = { data: {}, defintions: [] };
  const constants: Definitions = { data: {}, defintions: [] };
  const functions: Definitions = { data: {}, defintions: [] };
  const tables: Definitions = { data: {}, defintions: [] };

  const errors = [];

  // Parse the file contents.
  contents.forEach((content: string) => {
    let input = content;

    while (!isEndOfData(input)) {
      // Check if we are parsing a macro definition.
      if (HIGH_LEVEL.MACRO.test(input)) {
        // Parse macro definition
        const macro = input.match(HIGH_LEVEL.MACRO);

        // Add the macro to the macros array.
        macros.defintions.push(macro[2]);

        // macros[name] = body, args.
        macros.data[macro[2]] = { value: macro[7], args: parseArgs(macro[3]) };

        // Parse the macro.
        macros.data[macro[2]].data = parseMacro(macro[2], macros.data, constants.data, tables.data);

        // Slice the input
        input = input.slice(macro[0].length);
      }
      // Check if we are parsing a constant definition.
      else if (HIGH_LEVEL.CONSTANT.test(input)) {
        // Parse constant definition.
        const constant = input.match(HIGH_LEVEL.CONSTANT);
        const name = constant[2];
        const value = constant[3].substring(2);

        // Ensure that the constant name is all uppercase.
        if (name.toUpperCase() !== name) throw new Error(`Constant ${name} is not uppercase`);

        // Store the constant.
        constants.defintions.push(name);
        constants.data[name] = { value, args: [] };

        // Slice the input.
        input = input.slice(constant[0].length);
      }
      // Check if we are parsing a function definition.
      else if (HIGH_LEVEL.FUNCTION.test(input)) {
        // Parse the function definition.
        const functionDef = input.match(HIGH_LEVEL.FUNCTION);

        // Calculate the hash of the function definition and store the first 4 bytes.
        // This is the signature of the function.
        const name = functionDef[2];

        // Store the function values.
        const definition = {
          inputs: parseArgs(functionDef[3]),
          outputs: parseArgs(functionDef[5]),
          type: functionDef[4],
        };

        // Store the function definition.
        functions.data[name] = { value: name, args: [], data: definition };

        // Slice the input.
        input = input.slice(functionDef[0].length);
      }
      // Check if we're parsing a code table definition.
      else if (HIGH_LEVEL.CODE_TABLE.test(input)) {
        // Parse the table definition.
        const table = input.match(HIGH_LEVEL.CODE_TABLE);
        const body = table[3];

        // Parse the table.
        const parsed = parseCodeTable(body);

        // Store the table definition.
        tables.defintions.push(table[2]);
        tables.data[table[2]] = { value: body, args: [parsed.table, parsed.size] };

        // Slice the input
        input = input.slice(table[0].length);
      }

      // Check if we're parsing a packed table definition.
      else if (HIGH_LEVEL.JUMP_TABLE_PACKED.test(input)) {
        // Parse the table definition.
        const table = input.match(HIGH_LEVEL.JUMP_TABLE_PACKED);
        const type = table[1];

        // Ensure the type is valid.
        if (type !== "jumptable__packed")
          errors.push(
            `Error at line ${getLineNumber(
              input,
              content.indexOf(input)
            )}: Invalid type ${type} \n ${table[0]}`
          );

        // Parse the table.
        const body = table[3];
        const parsed = parseJumpTable(body, true);

        // Store the table definition.
        tables.defintions.push(table[2]);
        tables.data[table[2]] = {
          value: body,
          args: [parsed.jumps, parsed.size],
          data: [table[2], true],
        };

        // Slice the input.
        input = input.slice(table[0].length);
      }

      // Check if we're parsing a jump table definition.
      else if (HIGH_LEVEL.JUMP_TABLE.test(input)) {
        // Parse the table definition.
        const table = input.match(HIGH_LEVEL.JUMP_TABLE);
        const type = table[1];

        // Ensure the type is valid.
        if (type !== "jumptable")
          errors.push(
            `Error at line ${getLineNumber(
              input,
              content.indexOf(input)
            )}: Invalid type ${type} \n ${table[0]}`
          );

        // Parse the table.
        const body = table[3];
        const parsed = parseJumpTable(body, false);

        // Store the table definition.
        tables.defintions.push(table[2]);
        tables.data[table[2]] = {
          value: body,
          args: [parsed.jumps, parsed.size],
          data: [table[2], false],
        };

        // Slice the input.
        input = input.slice(table[0].length);
      } else {
        // Index of the next line break.
        const index = input.indexOf("\n");

        // If the index exists, slice the input.
        if (index !== -1) {
          input = input.slice(index);
        }
      }
    }
  });

  // Return all values
  return { macros, constants, functions, tables };
};

export const setStoragePointerConstants = (
  macrosToSearch: string[],
  macros: Definitions["data"],
  constants: Definitions
) => {
  // Generate an array of all storage pointer constants
  const storagePointerConstants = constants.defintions.filter((constant: string) =>
    constant.endsWith("_STORAGE_POINTER")
  );

  // Array of used storage pointer constants.
  const usedStoragePointerConstants = [];

  // Define a functinon that iterates over all macros and adds the storage pointer constants.
  const getUsedStoragePointerConstants = (name: string, revertIfNonExistant: boolean) => {
    // Store the macro body.
    let body = macros[name].value;

    // Check if the macro exists.
    if (!body) {
      // Check if we should revert (and revert).
      if (revertIfNonExistant) throw new Error(`Macro ${name} does not exist`);

      // Otherwise just return.
      return;
    }

    // If the next call is a constant call.
    if (body.match(MACRO_CODE.CONSTANT_CALL)) {
      // Store the constant definition.
      const definition = body.match(MACRO_CODE.CONSTANT_CALL);
      const constantName = definition[1];

      // Push the array to the usedStoragePointerConstants array.
      if (
        constantName.endsWith("_STORAGE_POINTER") &&
        !usedStoragePointerConstants.includes(constantName)
      ) {
        usedStoragePointerConstants.push(constantName);
      }

      // Slice the body.
      body = body.slice(definition[0].length);
    }
    // If the next call is a macro call.
    else if (body.match(MACRO_CODE.MACRO_CALL)) {
      // Store the macro definition.
      const definition = body.match(MACRO_CODE.MACRO_CALL);
      const macroName = definition[1];

      // Get the used storage pointer constants.
      getUsedStoragePointerConstants(macroName, true);

      // Slice the body.
      body = body.slice(definition[0].length);
    }
    // Otherwise just slice the body by one.
    else {
      body.slice(1);
    }
  };

  // Loop through the given macros and generate the used storage pointer constants.
  macrosToSearch.forEach((macroName) => {
    getUsedStoragePointerConstants(macroName, false);
  });

  // Iterate through the ordered pointers and generate
  // an array (ordered by the defined order) of all storage pointer constants.
  const orderedStoragePointerConstants = constants.defintions.filter((constant: string) => {
    usedStoragePointerConstants.includes(constant);
  });

  // Update and return the constants map.
  return setStoragePointers(constants.data, orderedStoragePointerConstants);
};

/**
 * Assign constants that use the builtin FREE_STORAGE_POINTER(
 * @param constants Maps the name of constants to their values
 * @param order The order that the constants were declared in
 */
export const setStoragePointers = (constants: Definitions["data"], order: string[]) => {
  const usedPointers: number[] = [];

  // Iterate over the array of constants.
  order.forEach((name) => {
    if (name.endsWith("_STORAGE_POINTER")) {
      const value = constants[name].value;

      // If the value is a hex literal.
      if (value.startsWith("0x")) {
        /* 
        If the pointer is already used, throw an error.
        In order to safely circumvent this, all constant-defined pointers must be defined before
        pointers that use FREE_STORAGE_POINTER.
        */
        if (usedPointers.includes(convertBytesToNumber(value))) {
          throw `Constant ${name} uses already existing pointer`;
        }

        // Add the pointer to the list of used pointers.
        usedPointers.push(convertBytesToNumber(value));
      }

      // The value calls FREE_STORAGE_POINTER.
      else if (value == "FREE_STORAGE_POINTER()") {
        // Find the lowest available pointer value.
        const pointer = findLowest(0, usedPointers);

        // Add the pointer to the list of used pointers.
        usedPointers.push(pointer);

        // Set the constant to the pointer value.
        constants[name].value = convertNumberToBytes(pointer);
      }
    }
  });

  // Return the new constants value.
  return constants;
};
