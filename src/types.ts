import { Sources } from "./parser/utils/contents";

/* Compilation File Input Type */
export type HuffCompilerFileArgs = {
  kind: "file";
  filePath: string;
  sources?: Sources;
  generateAbi: boolean;
  constructorArgs?: { type: string; value: string }[];
};

/* Compilation Content Only Input Type */
export type HuffCompilerContentArgs = {
  kind: "content";
  content: string;
  generateAbi: boolean;
  constructorArgs?: { type: string; value: string }[];
};

/* Compilation Input Type */
export type HuffCompilerArgs = HuffCompilerFileArgs | HuffCompilerContentArgs;
