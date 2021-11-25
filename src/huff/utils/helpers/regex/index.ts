import { comma, space, operator } from "./constants";
import { MACRO_CODE } from "../../langauge/syntax";

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
 * @returns A boolean inidicating whether the string is a literal
 */
export const isLiterals = (input: string) => {
  if (containsOperators(input)) {
    return true;
  } else if (input.match(MACRO_CODE.LITERAL_DECIMAL)) {
    return true;
  } else if (input.match(MACRO_CODE.LITERAL_HEX)) {
    return true;
  }

  return false;
};
