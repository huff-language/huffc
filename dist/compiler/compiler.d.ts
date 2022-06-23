import { Definitions } from "../parser/utils/types";
/**
 * Compile a macro into raw EVM bytecode.
 * @param name The name of the macro.
 * @param args An array of arguments passed into the macro.
 * @param macros Maps all macros to their raw text and arguments.
 * @param constants Maps all constants to their values.
 * @param jumptables Maps all jump tables to their jump values.
 */
export declare const compileMacro: (name: string, args: string[], macros: Definitions["data"], constants: Definitions["data"], jumptables: Definitions["data"]) => any;
//# sourceMappingURL=compiler.d.ts.map