import { Sources } from "./parser/utils/contents";
export declare type HuffCompilerFileArgs = {
    kind: "file";
    filePath: string;
    sources?: Sources;
    generateAbi: boolean;
    constructorArgs?: {
        type: string;
        value: string;
    }[];
};
export declare type HuffCompilerContentArgs = {
    kind: "content";
    content: string;
    generateAbi: boolean;
    constructorArgs?: {
        type: string;
        value: string;
    }[];
};
export declare type HuffCompilerArgs = HuffCompilerFileArgs | HuffCompilerContentArgs;
//# sourceMappingURL=types.d.ts.map