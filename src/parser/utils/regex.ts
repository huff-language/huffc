/* Constants */

export const comma = new RegExp("[^,\\s\\n]*", "g");
export const space = new RegExp("^[\\s\\n]*");
export const operator = new RegExp("[\\+\\-\\*]");

/**
 * Combine an array of regex strings into one, seperated by "\\s*\\n*"
 */
export const combineRegexElements = (regexElements: string[]): RegExp => {
  return new RegExp(regexElements.join("\\s*\\n*"));
};

/**
 * @param input A string containing words split by commas and spaces
 * @returns An array of of string, each element is one word
 */
export const removeSpacesAndCommas = (input: string): string[] => {
  return (input.match(comma) || []).filter((r) => r !== "");
};

/**
 * Removes all spaces and newlines from a string
 */
export const removeSpacesAndLines = (input) => {
  return input.replace(/(\r\n\t|\n|\r\t|\s)/gm, "");
};

/**
 * @returns A boolean indicating whether the input is the end of the data.
 */
export const isEndOfData = (data: string): boolean => {
  return !RegExp("\\S").test(data);
};

/**
 * Count the number of times an empty character appears in a string.
 */
export const countSpaces = (data: string): number => {
  const match = data.match(space);
  if (match) {
    return match[0].length;
  }

  // There are no empty spaces in the string
  return 0;
};

/**
 * @returns A boolean indicating whether the string contains operators.
 */
export const containsOperators = (input: string) => {
  return operator.test(input);
};

/**
 * @returns A boolean indicating whether the input is a valid literal.
 */
export const isLiteral = (input) => {
  if (input.match(new RegExp("^(?:\\s*\\n*)*0x([0-9a-fA-F]+)\\b"))) {
    return true;
  }

  return false;
};
