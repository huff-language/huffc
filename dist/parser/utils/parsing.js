"use strict";
exports.__esModule = true;
exports.throwErrors = exports.parseArgs = exports.getLineNumber = exports.removeComments = void 0;
var assert = require("assert");
var regex_1 = require("./regex");
/**
 * Given a string, generate a new string without inline comments
 * @param data A string of data to parse
 */
var removeComments = function (data) {
    // The formatted version of our string.
    var formattedData = "";
    while (!(0, regex_1.isEndOfData)(data)) {
        // Store the index of the next single line comment.
        var nextSingleLineCommentIndex = data.indexOf("//");
        // Store the index of the next multi-line comment.
        var nextMultiLineCommentIndex = data.indexOf("/*");
        // If  a multiline comment exists and is before the next single line comment
        if (nextMultiLineCommentIndex !== -1 &&
            (nextMultiLineCommentIndex > nextSingleLineCommentIndex || nextSingleLineCommentIndex === -1)) {
            // Add code from the start of the string to the multi-line comment.
            formattedData += data.slice(0, nextMultiLineCommentIndex);
            // Find the end of the multi-line comment block (throw if it does not exist)
            var endOfBlock = data.indexOf("*/");
            assert(endOfBlock !== -1, "Multi-line comment block never closed");
            // Replace the multi-line comments.
            formattedData += " ".repeat(endOfBlock - nextMultiLineCommentIndex + 2);
            // Slice the inputted data.
            data = data.slice(endOfBlock + 2);
        }
        // If a single line comment exists
        else if (nextSingleLineCommentIndex !== -1) {
            // Add code from the start of the string to the single line comment.
            formattedData += data.slice(0, nextSingleLineCommentIndex);
            data = data.slice(nextSingleLineCommentIndex);
            // The end of a single-lined comment is the end of the line
            var endOfBlock = data.indexOf("\n");
            if (!endOfBlock) {
                formattedData += " ".repeat(data.length);
                // Set data to "", since there is no more data to parse.
                data = "";
            }
            else {
                formattedData += " ".repeat(endOfBlock + 1);
                data = data.slice(endOfBlock + 1);
            }
        }
        else {
            // If there are no more comments, add the rest of the data to the formatted string.
            formattedData += data;
            break;
        }
    }
    return formattedData;
};
exports.removeComments = removeComments;
/**
 * Given a string and an index, get the line number that the index is located on
 */
var getLineNumber = function (str, index) {
    return str.substr(0, index).split("\n").length;
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
