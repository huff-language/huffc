/* Utils */
import { readFile } from "../../utils/helpers/data/files";
import { HIGH_LEVEL } from "../../utils/langauge/syntax";
import { removeComments } from "../../utils/langauge/parsing";
import { isEndOfData } from "../../utils/helpers/regex";

/**
 * Given file data, return three arrays containing the macros, constants, and tables.
 */
const getHighLevelDefinitions = (
  data: { filename: string; data: string }[]
): {
  macros: { name: string; raw: string }[];
  constants: { name: string; value: string }[];
  tables: { name: string; raw: string }[];
} => {
  // Arrays
  const macros: { name: string; raw: string }[] = [];
  const constants: { name: string; value: string }[] = [];
  const tables: { name: string; raw: string }[] = [];

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

        // Add the macro to the array.
        macros.push({ name: macro[2], raw: macro[0] });

        // Slice the input
        input = input.slice(macro[0].length);
      } else if (HIGH_LEVEL.CONSTANT.test(input)) {
        // Parse constant definition.
        const constant = input.match(HIGH_LEVEL.CONSTANT);

        // Add the constant to the array.
        constants.push({ name: constant[2], value: constant[3] });

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

  return { macros, constants, tables };
};

/**
 *
 * @param path Path of the file to be parsed
 * @returns An array of maps, containing the filename and raw data
 * and a string containing the raw data of all files combined
 */
const getFileContents = (path: string): { filename: string; data: string }[] => {
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
const getImports = (raw: string): string[] => {
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
