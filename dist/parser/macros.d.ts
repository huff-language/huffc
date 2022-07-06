import { Definitions, Operation } from "./utils/types";
/**
 * Parse a macro definition.
 * @param args The arguments passed into the macro.
 */
declare const parseMacro: (macro: string, macros: Definitions["data"], constants: Definitions["data"], jumptables: Definitions["data"]) => Operation[];
/** Parse argument */
export declare const parseArgument: (input: string, macros: Definitions["data"], constants: Definitions["data"]) => Definitions["data"];
export default parseMacro;
//# sourceMappingURL=macros.d.ts.map