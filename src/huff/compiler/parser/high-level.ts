/* Helpers Utils */
import { isEndOfData } from "../../utils/helpers/regex";
import { readFile } from "../../utils/helpers/data/files";

/* Language Utils */
import { removeComments } from "../../utils/langauge/parsing";
import { HIGH_LEVEL, MACRO_CODE } from "../../utils/langauge/syntax";

/* Parser Utils */
import { Definitions } from "../utils/enums";

/* Data Utils */
import {
  convertNumberToBytes,
  convertBytesToNumber,
  findLowest,
} from "../../utils/helpers/data/bytes";

/**
 * @param path File path to be parsed.
 * @returns Three arrays, containing the macros, constants, and tables
 * from the Huff file and from all files that it imports.
 */
const parseFile = (path: string): [Definitions, { macros: string[]; constants: string[] }] => {
  return getHighLevelDefinitions(getFileContents(path));
};

/**
 * Given file data, return three maps containing the macros, constants, and tables.
 */
export const getHighLevelDefinitions = (
  data: { filename: string; data: string }[]
): [Definitions, { macros: string[]; constants: string[] }] => {
  // Dictionaries
  const macros: { [name: string]: { args: string[]; body: string } } = {};
  const constants: { [name: string]: string } = {};
  const tables: { name: string; raw: string }[] = [];

  /*
   * Arrays
   * We store these in order to preserve the defined order of macros and constants.
   * This is important to know, because it is sometimes helpful to define functions in a specific order
   */
  const macrosArray: string[] = [];
  const constantsArray: string[] = [];

  // Parse the data
  data.forEach((file) => {
    // Store the current file data.
    let input = file.data;

    // Parse the file data.
    while (!isEndOfData(input)) {
      // Check if we are parsing a macro definition.
      if (HIGH_LEVEL.MACRO.test(input)) {
        // Parse macro definition.
        const macro = input.match(HIGH_LEVEL.MACRO);

        console.log(macro[3]);
        console.log(parseArgs(macro[3]));

        // macros[name] = {body, takes}
        macros[macro[2]] = { body: macro[7], args: parseArgs(macro[3]) };

        // Add macro to macrosArray.
        macrosArray.push(macro[2]);

        // Slice the input
        input = input.slice(macro[0].length);
      } else if (HIGH_LEVEL.CONSTANT.test(input)) {
        // Parse constant definition.
        const constant = input.match(HIGH_LEVEL.CONSTANT);
        const name = constant[2];
        const value = constant[3];

        // Ensure that the constant name is all uppercase.
        if (name.toUpperCase() !== name) throw new Error(`Constant ${name} is not uppercase`);

        // Add values to compiler data
        constants[name] = value;
        constantsArray.push(name);

        // Slice the input
        input = input.slice(constant[0].length);
      } else {
        const index = input.indexOf("\n");
        if (index !== -1) {
          input = input.slice(index);
        }
      }
    }
  });

  return [
    {
      macros,
      constants,
      tables,
    },
    { macros: macrosArray, constants: constantsArray },
  ];

  //return { macros, constants, tables };
};

/**
 * Return arrays of used macros, tables, and constants.
 * @param macros an array of macros to search.
 * @param data List of all macros, tables, and constants.
 */
export const getUsedDefinitions = (
  macrosToParse: string[],
  data: Definitions
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

/**
 *
 * @param path Path of the file to be parsed
 * @returns An array of maps, containing the filename and raw data
 * and a string containing the raw data of all files combined
 */
export const getFileContents = (path: string): { filename: string; data: string }[] => {
  // Array of filedata.
  const includes: { filename: string; data: string }[] = [];

  // Local function that reads a file and adds it to the includes map.
  // We instantiate this locally because we need to use it recursively to read all imports.
  const readFileData = (path: string): { filename: string; data: string }[] => {
    // Read the data from the file.

    const fileString = removeComments(readFile(path));
    let includes: { filename: string; data: string }[] = [{ filename: path, data: fileString }];

    // Read the file data of all the imported files.
    getImports(fileString).forEach((importPath) => {
      includes = [...includes, ...readFileData(importPath)];
    });

    return includes;
  };

  return readFileData(path);
};

/**
 * @returns an array of imported files
 */
export const getImports = (raw: string): string[] => {
  const imports: string[] = [];
  let nextImport = raw.match(HIGH_LEVEL.IMPORT);

  while (nextImport !== null) {
    // Add the path of the imported file to the imports array if it is not already there.
    if (!imports.includes(nextImport[1])) imports.push(nextImport[1]);

    // Remove the import statement.
    raw = raw.slice(nextImport[0].length);

    // Search for the next import statement.
    nextImport = raw.match(HIGH_LEVEL.IMPORT);
  }

  return imports;
};

/**
 * Parse an arguments list and convert it to an array

 */
const parseArgs = (argString) => {
  return argString.replace(" ", "").split(",");
};

// Default export should be parseFile.
export default parseFile;
