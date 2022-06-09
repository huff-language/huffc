import BN = require("bn.js");

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
export const findLowest = (value: number, arr: number[]): number => {
  return arr.indexOf(value) < 0 ? value : findLowest(value + 1, arr);
};

/**
 * Given two arrays, remove all elements from the first array that aren't in the second
 */
export const removeNonMatching = (arr1: any[], arr2: any[]) => {
  return arr1.filter((val) => arr2.includes(val));
};

/**
 * Format a hex literal to make its length even
 */
export const formatEvenBytes = (bytes: string) => {
  if (bytes.length % 2) {
    return `0${bytes}`;
  }
  return bytes;
};

/**
 * Convert a hex literal to a BigNumber
 */
export const toHex = (number: number): string => {
  return new BN(number, 10).toString(16);
};

/**
 * Pad a hex value with zeroes.
 */
export const padNBytes = (hex: string, numBytes: number) => {
  if (hex.length > numBytes * 2) {
    throw new Error(`value ${hex} has more than ${numBytes} bytes!`);
  }
  return hex.padStart(numBytes * 2, '0');
};
