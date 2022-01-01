"use strict";
exports.__esModule = true;
exports.compileMacro = void 0;
var bytes_1 = require("../utils/bytes");
var processor_1 = require("./processor");
/**
 * Compile a macro into raw EVM bytecode.
 * @param name The name of the macro.
 * @param args An array of arguments passed into the macro.
 * @param macros Maps all macros to their raw text and arguments.
 * @param constants Maps all constants to their values.
 * @param jumptables Maps all jump tables to their jump values.
 */
var compileMacro = function (name, args, macros, constants, jumptables) {
    // Process the macro and generate semi-complete EVM bytecode.
    var _a = (0, processor_1.processMacro)(name, 0, args, macros, constants, jumptables), bytecode = _a.bytecode, unmatchedJumps = _a.unmatchedJumps, tableInstances = _a.tableInstances, jumptable = _a.jumptable, jumpindices = _a.jumpindices;
    // Ensure that there are no unmatched jumps.
    if (unmatchedJumps.length > 0) {
        throw new Error("Compiler: Macro ".concat(name, " contains unmatched jump labels ").concat(unmatchedJumps
            .map(function (jump) { return jump.label; })
            .join(" "), ", cannot compile"));
    }
    // Instantiate variables
    var tableBytecodeOffset = bytecode.length / 2;
    var tableOffsets = {};
    // Iterate over the jumptables.
    Object.keys(jumptables).forEach(function (jumpkey) {
        // Get the jump table value.
        var table = jumptables[jumpkey];
        // Store the table code.
        var tableCode;
        // Store the jumps and size.
        var _a = table.args, jumps = _a[0], size = _a[1];
        // tableOffsets[name] = tableBytecodeOffset;
        tableOffsets[table.data[0]] = tableBytecodeOffset;
        // Incerment the table offset.
        tableBytecodeOffset += size;
        // Iterate through the jumplabels.
        tableCode = table.args[0]
            .map(function (jumplabel) {
            // If the label has not been defined, return "".
            if (!jumpindices[jumplabel])
                return "";
            // Otherwise, set the offset to the jumpindice.
            var offset = jumpindices[jumplabel];
            var hex = (0, bytes_1.formatEvenBytes)((0, bytes_1.toHex)(offset));
            // If the table has been compressed.
            if (!table.data[1]) {
                return (0, bytes_1.padNBytes)(hex, 0x20);
            }
            else {
                return (0, bytes_1.padNBytes)(hex, 0x02);
            }
        })
            .join("");
        bytecode += tableCode;
    });
    // Remove table instance placeholders.
    tableInstances.forEach(function (instance) {
        // Store the name and offset of the instance.
        var name = instance.label, offset = instance.bytecodeIndex;
        // Ensure the table has been defined.
        if (!tableOffsets[name]) {
            throw new Error("Expected to find ".concat(instance.label, " in ").concat(JSON.stringify(tableOffsets)));
        }
        // Slice the bytecode to get the code before and after the offset.
        var before = bytecode.slice(0, offset * 2 + 2);
        var after = bytecode.slice(offset * 2 + 6);
        // Insert the offset value.
        bytecode = "".concat(before).concat((0, bytes_1.padNBytes)((0, bytes_1.toHex)(tableOffsets[name]), 2)).concat(after);
    });
    return bytecode;
};
exports.compileMacro = compileMacro;
