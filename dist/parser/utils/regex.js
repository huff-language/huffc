"use strict";
/* Constants */
exports.__esModule = true;
exports.isLiteral = exports.containsOperators = exports.countSpaces = exports.isEndOfData = exports.removeSpacesAndLines = exports.removeSpacesAndCommas = exports.combineRegexElements = exports.operator = exports.space = exports.comma = void 0;
exports.comma = new RegExp("[^,\\s\\n]*", "g");
exports.space = new RegExp("^[\\s\\n]*");
exports.operator = new RegExp("[\\+\\-\\*]");
/**
 * Combine an array of regex strings into one, seperated by "\\s*\\n*"
 */
var combineRegexElements = function (regexElements) {
    return new RegExp(regexElements.join("\\s*\\n*"));
};
exports.combineRegexElements = combineRegexElements;
/**
 * @param input A string containing words split by commas and spaces
 * @returns An array of of string, each element is one word
 */
var removeSpacesAndCommas = function (input) {
    return (input.match(exports.comma) || []).filter(function (r) { return r !== ""; });
};
exports.removeSpacesAndCommas = removeSpacesAndCommas;
/**
 * Removes all spaces and newlines from a string
 */
var removeSpacesAndLines = function (input) {
    return input.replace(/(\r\n\t|\n|\r\t|\s)/gm, "");
};
exports.removeSpacesAndLines = removeSpacesAndLines;
/**
 * @returns A boolean indicating whether the input is the end of the data.
 */
var isEndOfData = function (data) {
    return !RegExp("\\S").test(data);
};
exports.isEndOfData = isEndOfData;
/**
 * Count the number of times an empty character appears in a string.
 */
var countSpaces = function (data) {
    var match = data.match(exports.space);
    if (match) {
        return match[0].length;
    }
    // There are no empty spaces in the string
    return 0;
};
exports.countSpaces = countSpaces;
/**
 * @returns A boolean indicating whether the string contains operators.
 */
var containsOperators = function (input) {
    return exports.operator.test(input);
};
exports.containsOperators = containsOperators;
/**
 * @returns A boolean indicating whether the input is a valid literal.
 */
var isLiteral = function (input) {
    if (input.match(new RegExp("^(?:\\s*\\n*)*0x([0-9a-fA-F]+)\\b"))) {
        return true;
    }
    return false;
};
exports.isLiteral = isLiteral;
