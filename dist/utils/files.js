"use strict";
exports.__esModule = true;
exports.readFile = void 0;
var path = require("path");
var fs = require("fs");
/**
 * Read a file and return its contents
 * @param filePath The path to the file
 */
var readFile = function (filePath) {
    var resolvedPath = path.resolve(filePath);
    if (!fs.existsSync(filePath)) {
        throw Error("File ".concat(filePath, " not found!"));
    }
    return fs.readFileSync(resolvedPath, "utf8");
};
exports.readFile = readFile;
