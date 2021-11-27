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
