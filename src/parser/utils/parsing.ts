import assert = require("assert");
import { isEndOfData } from "./regex";

/**
 * Given a string, generate a new string without inline comments
 * @param data A string of data to parse
 */
export const removeComments = (string: string): string => {
  // The formatted version of our string.
  let formattedData: string = "";

  let data = string;
  let formatted = "";

  while (!isEndOfData(data)) {
    const multiIndex = data.indexOf("/*");
    const singleIndex = data.indexOf("//");

    if (multiIndex !== -1 && (multiIndex < singleIndex || singleIndex === -1)) {
      formatted += data.slice(0, multiIndex);
      const endBlock = data.indexOf("*/");

      if (endBlock === -1) throw new Error("Could not find closing comment block.");

      formatted += " ".repeat(endBlock - multiIndex + 2);
      data = data.slice(endBlock + 2);
    } else if (singleIndex !== -1) {
      formatted += data.slice(0, singleIndex);
      data = data.slice(singleIndex);
      const endBlock = data.indexOf("\n");
      if (endBlock === -1) {
        formatted += " ".repeat(data.length);
        data = "";
      } else {
        formatted += " ".repeat(endBlock + 1);
        data = data.slice(endBlock + 1);
      }
    } else {
      formatted += data;
      break;
    }
  }

  return formatted;
};

/**
 * Given a string and an index, get the line number that the index is located on
 */
export const getLineNumber = (str: string, org: string): number => {
  // Get the index of the current input.
  const index = org.indexOf(str);

  // Get the line number of the file.
  return str.substring(0, index).split("\n").length;
};

/**
 * Parse an arguments list and convert it to an array
 */
export const parseArgs = (argString: string) => {
  return argString.replace(" ", "").replace(" ", "").split(",");
};

/**
 * Throw errors
 */
export const throwErrors = (errors: string[]) => {
  if (errors.length > 0) {
    errors.map((error) => {
      process.stderr.write(`${error}\n`);
    });

    throw new Error("");
  }
};
