import assert = require("assert");
import { isEndOfData } from "../helpers/regex";

/**
 * Given a string, generate a new string without inline comments
 * @param data A string of data to parse
 */
export const removeComments = (data: string): string => {
  // The formatted version of our string.
  let formattedData: string = "";

  while (!isEndOfData(data)) {
    // Store the index of the next single line comment.
    const nextSingleLineCommentIndex = data.indexOf("//");

    // Store the index of the next multi-line comment.
    const nextMultiLineCommentIndex = data.indexOf("/*");

    // If  a multiline comment exists and is before the next single line comment
    if (
      nextMultiLineCommentIndex !== -1 &&
      (nextMultiLineCommentIndex > nextSingleLineCommentIndex || nextSingleLineCommentIndex === -1)
    ) {
      // Add code from the start of the string to the multi-line comment.
      formattedData += data.slice(0, nextMultiLineCommentIndex);

      // Find the end of the multi-line comment block (throw if it does not exist)
      const endOfBlock = data.indexOf("*/");
      assert(endOfBlock !== -1, `Multi-line comment block never closed`);

      // Replace the multi-line comments.
      formattedData += " ".repeat(endOfBlock - nextMultiLineCommentIndex + 2);

      // Slice the inputted data.

      data = data.slice(endOfBlock + 2);
    }
    // If a single line comment exists
    else if (nextSingleLineCommentIndex !== -1) {
      // Add code from the start of the string to the single line comment.
      formattedData += data.slice(0, nextSingleLineCommentIndex);
      data = data.slice(nextSingleLineCommentIndex);

      // The end of a single-lined comment is the end of the line
      const endOfBlock = data.indexOf("\n");

      if (!endOfBlock) {
        formattedData += " ".repeat(data.length);

        // Set data to "", since there is no more data to parse.
        data = "";
      } else {
        formattedData += " ".repeat(endOfBlock + 1);
        data = data.slice(endOfBlock + 1);
      }
    } else {
      // If there are no more comments, add the rest of the data to the formatted string.
      formattedData += data;
      break;
    }
  }

  return formattedData;
};

/**
 * Given a string and an index, get the line number that the index is located on
 */
export const getLineNumber = (str: string, index: number): number => {
  return str.substr(0, index).split("\n").length;
};
