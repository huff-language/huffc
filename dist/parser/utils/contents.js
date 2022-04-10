"use strict";
/* Imports */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var defintions_1 = require("../syntax/defintions");
var parsing_1 = require("./parsing");
var files_1 = require("../../utils/files");
/**
 * Given a file path, return a string containing the raw
 * file contents of all imported files (including files imported in imported files).
 * @param filepath The path to the original file
 */
var getAllFileContents = function (filepath) {
    // Map indicating whether the filepath has been included.
    var imported = { filepath: true };
    // An array of all imported files.
    var files = [filepath];
    // Function that reads a file and adds it to the contents array.
    var getContents = function (filepath, imported) {
        // Read the data from the file and remove all comments.
        var contents = (0, parsing_1.removeComments)((0, files_1.readFile)(filepath));
        var includes = [contents];
        var imports = [filepath];
        // Read the file data from each of the imported files.
        getImports(contents).forEach(function (importPath) {
            // If the file has been imported, skip.
            if (imported[importPath])
                return;
            var _a = getContents(importPath, imported), newIncludes = _a[0], newImports = _a[1];
            // Add the file contents to the includes array.
            includes = __spreadArray(__spreadArray([], newIncludes, true), includes, true);
            // Add the file to the imports array.
            imports = __spreadArray(__spreadArray([], files, true), newImports, true);
            // Mark the file as imported.
            imported[importPath] = true;
        });
        return [includes, imports];
    };
    // Get the file contents.
    return { contents: getContents(filepath, imported)[0], imports: files };
};
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
exports["default"] = getAllFileContents;
