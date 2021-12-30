"use strict";
exports.__esModule = true;
exports.padNBytes = exports.toHex = exports.formatEvenBytes = exports.removeNonMatching = exports.findLowest = exports.convertNumberToBytes = exports.convertBytesToNumber = void 0;
var BN = require("bn.js");
/**
 * Convert a hex literal to a number
 * @param bytes A string representing a hex literal.
 */
var convertBytesToNumber = function (bytes) {
    return parseInt(bytes.slice(2), 10);
};
exports.convertBytesToNumber = convertBytesToNumber;
/**
 * Convert a number to a hex literal
 */
var convertNumberToBytes = function (number) {
    var value = parseInt(number.toString(), 10).toString(16);
    return "0x".concat(value.length % 2 == 0 ? value : "0" + value);
};
exports.convertNumberToBytes = convertNumberToBytes;
/**
 * Given an array, find the lowest missing (non-negative) number
 */
var findLowest = function (value, arr) {
    return arr.indexOf(value) < 0 ? value : (0, exports.findLowest)(value + 1, arr);
};
exports.findLowest = findLowest;
/**
 * Given two arrays, remove all elements from the first array that aren't in the second
 */
var removeNonMatching = function (arr1, arr2) {
    return arr1.filter(function (val) { return arr2.includes(val); });
};
exports.removeNonMatching = removeNonMatching;
/**
 * Format a hex literal to make its length even
 */
var formatEvenBytes = function (bytes) {
    if (Math.floor(bytes.length / 2) * 2 !== bytes.length) {
        return "0".concat(bytes);
    }
    return bytes;
};
exports.formatEvenBytes = formatEvenBytes;
/**
 * Convert a hex literal to a BigNumber
 */
var toHex = function (number) {
    return new BN(number, 10).toString(16);
};
exports.toHex = toHex;
/**
 * Pad a hex value with zeroes.
 */
var padNBytes = function (hex, numBytes) {
    if (hex.length > numBytes * 2) {
        throw new Error("value ".concat(hex, " has more than ").concat(numBytes, " bytes!"));
    }
    var result = hex;
    while (result.length < numBytes * 2) {
        result = "0".concat(result);
    }
    return result;
};
exports.padNBytes = padNBytes;
