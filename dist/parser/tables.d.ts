/**
 * Parse a code table definition
 * @param body The raw string representing the body of the table.
 */
export declare const parseCodeTable: (body: string) => {
    table: string;
    size: number;
};
/**
 * Parse a jumptable definition
 * @param body The raw string representing the body of the table.
 */
export declare const parseJumpTable: (body: string, compressed?: boolean) => {
    jumps: string[];
    size: number;
};
//# sourceMappingURL=tables.d.ts.map