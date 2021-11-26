/* High level parser for Huff files */

/* Utils */
import { readFile } from "../../utils/helpers/data/files";
import { HIGH_LEVEL } from "../../utils/langauge/syntax";
import { removeComments } from "../../utils/langauge/parsing";

/**
 *
 * @param path Path of the file to be parsed
 * @returns An array of maps, containing the filename and raw data
 * and a string containing the raw data of all files combined
 */
const getFileContents = (
  path: string
): { fileData: { path: string; rawInput: string }[]; raw: string } => {
  // Read the data from the file.
  const fileString = removeComments(readFile(path));

  return { fileData: [], raw: "" };
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
  }
  return imports;
};
