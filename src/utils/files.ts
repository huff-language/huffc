import path = require("path");
import fs = require("fs");

/**
 * Read a file and return its contents
 * @param filePath The path to the file
 */
export const readFile = (filePath: string): string => {
  return fs.readFileSync(path.posix.resolve(filePath), "utf8");
};
