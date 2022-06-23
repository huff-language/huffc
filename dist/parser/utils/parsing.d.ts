/**
 * Given a string, generate a new string without inline comments
 * @param data A string of data to parse
 */
export declare const removeComments: (string: string) => string;
/**
 * Given a string and an index, get the line number that the index is located on
 */
export declare const getLineNumber: (str: string, org: string) => number;
/**
 * Parse an arguments list and convert it to an array
 */
export declare const parseArgs: (argString: string) => string[];
/**
 * Throw errors
 */
export declare const throwErrors: (errors: string[]) => void;
//# sourceMappingURL=parsing.d.ts.map