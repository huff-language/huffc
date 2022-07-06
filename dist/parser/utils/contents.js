"use strict";
/* Imports */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var defintions_1 = require("../syntax/defintions");
var parsing_1 = require("./parsing");
var files_1 = require("../../utils/files");
var path_1 = __importDefault(require("path"));
/**
 * Given the contents of the file, return an array
 * of filepaths that are imported by the file.
 * @param contents The raw contents of the file.
 */
var getImports = function (contents) {
    var imports = [];
    var nextImport = contents.match(defintions_1.HIGH_LEVEL.IMPORT);
    // While there are still imports to find.
    while (nextImport) {
        // Add the path of the imported file if it hasn't been added already.
        if (!imports.includes(nextImport[1]))
            imports.push(nextImport[1]);
        // Remove the import statement from the file contents
        // so the parser can find the next import.
        contents = contents.slice(nextImport[0].length);
        // Find the next import statement (this is null if not found).
        nextImport = contents.match(defintions_1.HIGH_LEVEL.IMPORT);
    }
    return imports;
};
/**
 * Retrieve the content and paths of a given file and all its
 * imports, including nested imports.
 * @param filePath Path to the file to read from.
 * @param imported An object indicating whether a file has already
 * been imported.
 * @param getFile Function to get file contents for a given path.
 * @returns Object containing the contents and path of each
 * file in the project.
 */
var getNestedFileContents = function (filePath, imported, getFile) {
    var fileData = getFile(filePath);
    if (!fileData)
        throw Error("File not found: ".concat(filePath));
    var contents = (0, parsing_1.removeComments)(fileData);
    var dir = path_1["default"].parse(filePath).dir;
    var relativeImports = getImports(contents);
    // Normalize the import paths by making them relative
    // to the root directory.
    var normalizedImports = relativeImports.map(function (relativeImport) { return path_1["default"].join(dir, relativeImport); });
    var fileContents = [];
    var filePaths = [];
    imported[filePath] = true;
    for (var _i = 0, normalizedImports_1 = normalizedImports; _i < normalizedImports_1.length; _i++) {
        var importPath = normalizedImports_1[_i];
        if (imported[importPath])
            continue;
        var _a = getNestedFileContents(importPath, imported, getFile), importContents = _a.fileContents, importPaths = _a.filePaths;
        fileContents.push.apply(fileContents, importContents);
        filePaths.push.apply(filePaths, importPaths);
    }
    fileContents.push(contents);
    filePaths.push(filePath);
    return { fileContents: fileContents, filePaths: filePaths };
};
var normalizeFilePath = function (filePath) {
    var _a = path_1["default"].parse(filePath), dir = _a.dir, base = _a.base;
    return path_1["default"].join(dir, base);
};
/**
 * Normalizes the keys in a sources object to ensure the file
 * reader can access them.
 */
var normalizeSourcePaths = function (sources) {
    var normalizedSources = {};
    var keys = Object.keys(sources);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var normalizedKey = normalizeFilePath(key);
        normalizedSources[normalizedKey] = sources[key];
    }
    return normalizedSources;
};
/**
 * Given a file path, return a string containing the raw
 * file contents of all imported files (including files imported in imported files).
 * @param entryFilePath Path to the main file of the project.
 * @param sources Object with file paths (relative to the root directory) mapped to their
 * contents. If no sources object is provided, the files will be read from the file system.
 */
var getAllFileContents = function (entryFilePath, sources) {
    // Normalize the keys in the sources object
    var normalizedSources = sources && normalizeSourcePaths(sources);
    // Get file from provided sources or by reading from the filesystem
    var getFile = function (filePath) {
        if (sources) {
            var content = normalizedSources[filePath];
            if (!content) {
                throw Error("File ".concat(filePath, " not found in provided sources!"));
            }
            return content;
        }
        else {
            return (0, files_1.readFile)(filePath);
        }
    };
    return getNestedFileContents(normalizeFilePath(entryFilePath), {}, getFile);
};
exports["default"] = getAllFileContents;
