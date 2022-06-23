export declare const comma: RegExp;
export declare const space: RegExp;
export declare const operator: RegExp;
/**
 * Combine an array of regex strings into one, seperated by "\\s*\\n*"
 */
export declare const combineRegexElements: (regexElements: string[]) => RegExp;
/**
 * @param input A string containing words split by commas and spaces
 * @returns An array of of string, each element is one word
 */
export declare const removeSpacesAndCommas: (input: string) => string[];
/**
 * Removes all spaces and newlines from a string
 */
export declare const removeSpacesAndLines: (input: any) => any;
/**
 * @returns A boolean indicating whether the input is the end of the data.
 */
export declare const isEndOfData: (data: string) => boolean;
/**
 * Count the number of times an empty character appears in a string.
 */
export declare const countSpaces: (data: string) => number;
/**
 * @returns A boolean indicating whether the string contains operators.
 */
export declare const containsOperators: (input: string) => boolean;
/**
 * @returns A boolean indicating whether the input is a valid literal.
 */
export declare const isLiteral: (input: any) => boolean;
//# sourceMappingURL=regex.d.ts.map