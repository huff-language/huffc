import path = require("path");
import fs = require("fs");

/**
 * Read a file and return its contents
 * @param filePath The path to the file
 */
export const readFile = (filePath: string): string => {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(filePath)) {
    throw Error(`File ${filePath} not found!`)
  }
  return fs.readFileSync(resolvedPath, "utf8");
};
