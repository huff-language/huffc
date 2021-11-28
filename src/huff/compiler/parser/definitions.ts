/* Utils */
import { isEndOfData } from "../../utils/helpers/regex";
import { MACRO_CODE } from "../../utils/langauge/syntax";

import {
  convertNumberToBytes,
  convertBytesToNumber,
  findLowest,
} from "../../utils/helpers/data/bytes";

/**
 * Return arrays of used macros, tables, and constants.
 * @param macros an array of macros to search.
 * @param data List of all macros, tables, and constants.
 */
export const getUsedDefinitions = (
  macrosToParse: string[],
  data: {
    macros: { [name: string]: { args: number; body: string } };
    constants: { [name: string]: string };
    tables: { name: string; raw: string }[];
  }
): {
  macros: string[];
  constants: string[];
  tables: string[];
} => {
  // Arrays of functions to search for.
  const macros: string[] = [];
  const constants: string[] = [];

  // Iterate over the inputted array of macros.
  macrosToParse.forEach((name) => {
    // Retrieve macro from map.
    const macro = data.macros[name];

    // If the macro doesn't exist, move to the next macro.
    if (!macro) return;

    // Get the body of the macro.
    let body = macro.body;

    // Iterate over the macro body.
    while (!isEndOfData(body)) {
      // If the next call is a constant call.
      if (body.match(MACRO_CODE.CONSTANT_CALL)) {
        const constantName = body.match(MACRO_CODE.CONSTANT_CALL)[0].replace(" ", "");

        if (data.constants[constantName]) {
          constants.push(constantName);
        } else {
          throw `${constantName} is not defined`;
        }

        body = body.slice(body.match(MACRO_CODE.CONSTANT_CALL)[0].length);
      } else {
        body = body.slice(1);
      }
    }
  });

  return { macros, constants, tables: [] };
};

/**
 * Assign constants that use the builtin FREE_STORAGE_POINTER(
 * @param constants Maps the name of constants to their values
 * @param order The order that the constants were declared in
 */
export const setStoragePointerConstants = (
  constants: { [name: string]: string },
  order: string[]
) => {
  const usedPointers: number[] = [];

  // Iterate over the array of constants.
  order.forEach((name) => {
    if (name.endsWith("_STORAGE_POINTER")) {
      const value = constants[name];

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
        constants[name] = convertNumberToBytes(pointer);
      }
    }
  });
};
