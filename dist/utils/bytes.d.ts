/**
 * Convert a hex literal to a number
 * @param bytes A string representing a hex literal.
 */
export declare const convertBytesToNumber: (bytes: string) => number;
/**
 * Convert a number to a hex literal
 */
export declare const convertNumberToBytes: (number: number) => string;
/**
 * Given an array, find the lowest missing (non-negative) number
 */
export declare const findLowest: (value: number, arr: number[]) => number;
/**
 * Given two arrays, remove all elements from the first array that aren't in the second
 */
export declare const removeNonMatching: (arr1: any[], arr2: any[]) => any[];
/**
 * Format a hex literal to make its length even
 */
export declare const formatEvenBytes: (bytes: string) => string;
/**
 * Convert a hex literal to a BigNumber
 */
export declare const toHex: (number: number) => string;
/**
 * Pad a hex value with zeroes.
 */
export declare const padNBytes: (hex: string, numBytes: number) => string;
//# sourceMappingURL=bytes.d.ts.map