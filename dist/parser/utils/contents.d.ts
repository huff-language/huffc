export declare type Sources = Record<string, string>;
export declare type FileContents = {
    fileContents: string[];
    filePaths: string[];
};
/**
 * Given a file path, return a string containing the raw
 * file contents of all imported files (including files imported in imported files).
 * @param entryFilePath Path to the main file of the project.
 * @param sources Object with file paths (relative to the root directory) mapped to their
 * contents. If no sources object is provided, the files will be read from the file system.
 */
declare const getAllFileContents: (entryFilePath: string, sources?: Sources) => FileContents;
export default getAllFileContents;
//# sourceMappingURL=contents.d.ts.map