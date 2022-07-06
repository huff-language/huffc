import { Definitions } from "../parser/utils/types";
/**
 * Process a macro, generating semi-complete EVM bytecode.
 * @param name The name of the macro.
 * @param bytecodeOffset The offset of the macro's bytecode.
 * @param args The arguments passed into the array.
 * @param macros Maps all macros to their raw text and arguments.
 * @param constants Maps all constants to their values.
 * @param jumptables Maps all jump tables to their jump values.
 * @returns Semi-complete EVM bytecode.
 */
export declare const processMacro: (name: string, bytecodeOffset: number, args: string[], macros: Definitions["data"], constants: Definitions["data"], jumptables: Definitions["data"]) => any;
//# sourceMappingURL=processor.d.ts.map