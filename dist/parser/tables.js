"use strict";
exports.__esModule = true;
exports.parseJumpTable = exports.parseCodeTable = void 0;
var defintions_1 = require("./syntax/defintions");
var regex_1 = require("./utils/regex");
/**
 * Parse a code table definition
 * @param body The raw string representing the body of the table.
 */
var parseCodeTable = function (body) {
    // Parse the body of the table.
    var table = body
        .match(defintions_1.JUMP_TABLES.JUMPS)
        .map(function (jump) {
        return (0, regex_1.removeSpacesAndLines)(jump);
    })
        .join("");
    // Return the table data.
    return { table: table, size: table.length / 2 };
};
exports.parseCodeTable = parseCodeTable;
/**
 * Parse a jumptable definition
 * @param body The raw string representing the body of the table.
 */
var parseJumpTable = function (body, compressed) {
    if (compressed === void 0) { compressed = false; }
    // Parse the body of the table
    var jumps = body.match(defintions_1.JUMP_TABLES.JUMPS).map(function (jump) {
        return (0, regex_1.removeSpacesAndLines)(jump);
    });
    // Calculate the size of the table.
    var size;
    if (compressed)
        size = jumps.length * 0x02;
    else
        size = jumps.length * 0x20;
    // Return the array of jumps and the size of the table.
    return {
        jumps: jumps,
        size: size
    };
};
exports.parseJumpTable = parseJumpTable;
