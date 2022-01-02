"use strict";
exports.__esModule = true;
exports.throwErrors = exports.parseArgs = exports.getLineNumber = exports.removeComments = void 0;
var regex_1 = require("./regex");
/**
 * Given a string, generate a new string without inline comments
 * @param data A string of data to parse
 */
var removeComments = function (string) {
    // The formatted version of our string.
    var formattedData = "";
    var data = string;
    var formatted = "";
    while (!(0, regex_1.isEndOfData)(data)) {
        var multiIndex = data.indexOf("/*");
        var singleIndex = data.indexOf("//");
        if (multiIndex !== -1 && (multiIndex < singleIndex || singleIndex === -1)) {
            formatted += data.slice(0, multiIndex);
            var endBlock = data.indexOf("*/");
            if (endBlock === -1)
                throw new Error("Could not find closing comment block.");
            formatted += " ".repeat(endBlock - multiIndex + 2);
            data = data.slice(endBlock + 2);
        }
        else if (singleIndex !== -1) {
            formatted += data.slice(0, singleIndex);
            data = data.slice(singleIndex);
            var endBlock = data.indexOf("\n");
            if (endBlock === -1) {
                formatted += " ".repeat(data.length);
                data = "";
            }
            else {
                formatted += " ".repeat(endBlock + 1);
                data = data.slice(endBlock + 1);
            }
        }
        else {
            formatted += data;
            break;
        }
    }
    return formatted;
};
exports.removeComments = removeComments;
/**
 * Given a string and an index, get the line number that the index is located on
 */
var getLineNumber = function (str, org) {
    // Get the index of the current input.
    var index = org.indexOf(str);
    // Get the line number of the file.
    return str.substring(0, index).split("\n").length;
};
exports.getLineNumber = getLineNumber;
/**
 * Parse an arguments list and convert it to an array
 */
var parseArgs = function (argString) {
    return argString.replace(" ", "").replace(" ", "").split(",");
};
exports.parseArgs = parseArgs;
/**
 * Throw errors
 */
var throwErrors = function (errors) {
    if (errors.length > 0) {
        errors.map(function (error) {
            console.log(error);
        });
        throw new Error("");
    }
};
exports.throwErrors = throwErrors;
