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
    return fs.readFileSync(path.posix.resolve(filePath), "utf8");
};
exports.readFile = readFile;
