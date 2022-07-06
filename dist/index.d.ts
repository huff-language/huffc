import { HuffCompilerArgs } from "./types";
/**
 * Compile a Huff file.
 * @param filePath The path to the file.
 * @param args An array containing the arguments to the macro.
 * @returns The compiled bytecode.
 */
declare const compile: (args: HuffCompilerArgs) => {
    bytecode: string;
    runtimeBytecode: any;
    abi: string;
};
export default compile;
//# sourceMappingURL=index.d.ts.map