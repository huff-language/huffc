/* Imports */

import { HIGH_LEVEL } from "./syntax/defintions";
import { removeComments } from "./utils/parsing";
import { readFile } from "../utils/files";

/**
 * Given a file path, return a string containing the raw
 * file contents of all imported files (including files imported in imported files).
 * @param filepath The path to the original file
 */
const getAllFileContents = (filepath: string) => {
  // Array of raw file contents.
  const contents: string[] = [];

  // Map indicating whether the filepath has been included.
  const imported: { [filepath: string]: boolean } = {};

  // Function that reads a file and adds it to the contents array.
  const getContents = (filepath: string, imported: { [filepath: string]: boolean }): string[] => {
    // Read the data from the file and remove all comments.
    const contents = removeComments(readFile(filepath));
    let includes: string[] = [contents];

    // Read the file data from each of the imported files.
    getImports(contents).forEach((importPath) => {
      // If the file has been imported, skip.
      if (imported[importPath]) return;

      // Add the file contents to the includes array.
      includes = [...includes, ...getContents(importPath, imported)];

      // Mark the file as imported.
      imported[importPath] = true;
    });

    return includes;
  };

  // Get the file contents.
  return getContents(filepath, imported);
};

/**
 * Given the contents of the file, return an array
 * of filepaths that are imported by the file.
 * @param contents The raw contents of the file.
 */
const getImports = (contents: string) => {
  const imports: string[] = [];
  let nextImport = contents.match(HIGH_LEVEL.IMPORT);

  // While there are still imports to find.
  while (nextImport) {
    // Add the path of the imported file if it hasn't been added already.
    if (!imports.includes(nextImport[1])) imports.push(nextImport[1]);

    // Remove the import statement from the file contents
    // so the parser can find the next import.
    contents = contents.slice(nextImport[0].length);

    // Find the next import statement (this is null if not found).
    nextImport = contents.match(HIGH_LEVEL.IMPORT);
  }

  return imports;
};
