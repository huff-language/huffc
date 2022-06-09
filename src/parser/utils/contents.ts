/* Imports */

import { HIGH_LEVEL } from "../syntax/defintions";
import { removeComments } from "./parsing";
import { readFile } from "../../utils/files";
import path from 'path';

export type Sources = Record<string, string>;

export type FileContents = {
  fileContents: string[];
  filePaths: string[];
}

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

/**
 * Retrieve the content and paths of a given file and all its
 * imports, including nested imports.
 * @param filePath Path to the file to read from.
 * @param imported An object indicating whether a file has already
 * been imported.
 * @param getFile Function to get file contents for a given path.
 * @returns Object containing the contents and path of each
 * file in the project.
 */
const getNestedFileContents = (
  filePath: string,
  imported: Record<string, boolean>,
  getFile: (filePath: string) => string
): FileContents => {
  const fileData = getFile(filePath);
  if (!fileData) throw Error(`File not found: ${filePath}`);
  const contents = removeComments(fileData);
  const { dir } = path.parse(filePath);
  const relativeImports = getImports(contents);
  // Normalize the import paths by making them relative
  // to the root directory.
  const normalizedImports = relativeImports.map(
    (relativeImport) => path.join(dir, relativeImport)
  );
  const fileContents: string[] = [];
  const filePaths: string[] = [];
  imported[filePath] = true;
  for (const importPath of normalizedImports) {
    if (imported[importPath]) continue;
    const {
      fileContents: importContents,
      filePaths: importPaths
    } = getNestedFileContents(importPath, imported, getFile);
    fileContents.push(...importContents);
    filePaths.push(...importPaths);
  }
  fileContents.push(contents);
  filePaths.push(filePath);
  return { fileContents, filePaths };
}

const normalizeFilePath = (filePath: string) => {
  const { dir, base } = path.parse(filePath);
  return path.join(dir, base);
}

/**
 * Normalizes the keys in a sources object to ensure the file
 * reader can access them.
 */
 const normalizeSourcePaths = (sources: Sources) => {
  const normalizedSources: Sources = {};
  const keys = Object.keys(sources);
  for (const key of keys) {
    const normalizedKey = normalizeFilePath(key);
    normalizedSources[normalizedKey] = sources[key];
  }
  return normalizedSources;
}

/**
 * Given a file path, return a string containing the raw
 * file contents of all imported files (including files imported in imported files).
 * @param entryFilePath Path to the main file of the project.
 * @param sources Object with file paths (relative to the root directory) mapped to their
 * contents. If no sources object is provided, the files will be read from the file system.
 */
const getAllFileContents = (entryFilePath: string, sources?: Sources): FileContents => {
  // Normalize the keys in the sources object
  const normalizedSources = sources && normalizeSourcePaths(sources);

  // Get file from provided sources or by reading from the filesystem
  const getFile = (filePath: string) => {
    if (sources) {
      const content = normalizedSources[filePath];
      if (!content) {
        throw Error(`File ${filePath} not found in provided sources!`);
      }
      return content;
    } else {
      return readFile(filePath);
    }
  };

  return getNestedFileContents(
    normalizeFilePath(entryFilePath),
    {},
    getFile
  );
};

export default getAllFileContents;
