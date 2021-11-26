import path = require("path");
import fs = require("fs");

export const readFile = (filePath: string): string => {
  return fs.readFileSync(path.posix.resolve(filePath), "utf8");
};
