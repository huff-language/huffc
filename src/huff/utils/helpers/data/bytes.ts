/**
 * Convert a hex literal to a number
 * @param bytes A string representing a hex literal.
 */
export const convertBytesToNumber = (bytes: string): number => {
  return parseInt(bytes.slice(2), 10);
};

/**
 * Convert a number to a hex literal
 */
export const convertNumberToBytes = (number: number): string => {
  const value = parseInt(number.toString(), 10).toString(16);
  return `0x${value.length % 2 == 0 ? value : "0" + value}`;
};

/**
 * Given an array, find the lowest missing (non-negative) number
 */
export const findLowest = (value: number, arr: number[]) => {
  return arr.indexOf(value) < 0 ? value : findLowest(value + 1, arr);
};

/**
 * Given two arrays, remove all elements from the first array that aren't in the second
 */
export const removeNonMatching = (arr1: any[], arr2: any[]) => {
  return arr1.filter((val) => arr2.includes(val));
};
