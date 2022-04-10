"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.processMacro = void 0;
var opcodes_1 = require("../evm/opcodes");
var macros_1 = require("../parser/macros");
var types_1 = require("../parser/utils/types");
var bytes_1 = require("../utils/bytes");
/**
 * Process a macro, generating semi-complete EVM bytecode.
 * @param name The name of the macro.
 * @param bytecodeOffset The offset of the macro's bytecode.
 * @param args The arguments passed into the array.
 * @param macros Maps all macros to their raw text and arguments.
 * @param constants Maps all constants to their values.
 * @param jumptables Maps all jump tables to their jump values.
 * @returns Semi-complete EVM bytecode.
 */
var processMacro = function (name, bytecodeOffset, args, macros, constants, jumptables) {
    // Check if the macro exists.
    var macro = macros[name];
    if (!macro)
        throw new Error("Processor: Failed to find ".concat(macro, "."));
    // Map argument names to values.
    var params = {};
    macro.args.forEach(function (arg, index) {
        params[arg] = args[index];
    });
    // Instantiate variables.
    var jumptable = [];
    var jumpindices = {};
    var tableInstances = [];
    var offset = bytecodeOffset;
    // Store a copy of the body and args.
    var codes = macro.data.map(function (operation, index) {
        switch (operation.type) {
            // We're parsing a macro call.
            case types_1.OperationType.MACRO_CALL: {
                // Replace macro arguments with their values.
                operation.args.map(function (arg, index) {
                    if (arg.startsWith("<") && arg.endsWith(">"))
                        operation.args[index] = args[index];
                });
                // Process the macro call.
                var result = (0, exports.processMacro)(operation.value, offset, operation.args, macros, constants, jumptables);
                // Add the result to local variables.
                tableInstances = __spreadArray(__spreadArray([], tableInstances, true), result.tableInstances, true);
                jumptable[index] = result.jumptable = result.unmatchedJumps;
                jumpindices = __assign(__assign({}, jumpindices), result.jumpindices);
                // Add to the offset.
                offset += result.bytecode.length / 2;
                // Return the result.
                return result.bytecode;
            }
            // We're parsing a constant call.
            case types_1.OperationType.CONSTANT_CALL: {
                // Get the value of the constant.
                var value = constants[operation.value].value;
                // Get the push value
                var push = "".concat((0, bytes_1.toHex)(95 + value.length / 2)).concat(value);
                // Add to the offset.
                offset += push.length / 2;
                // Return the bytecode
                return push;
            }
            // We're parsing an argument call.
            case types_1.OperationType.ARG_CALL: {
                // Get the value of the argument.
                var arg = params[operation.value];
                // Parse the arguments.
                var result = (0, exports.processMacro)(arg, offset, operation.args, (0, macros_1.parseArgument)(arg, macros, constants), constants, jumptables);
                // Set the jumplabels to the macro's unmatched jumps.
                jumptable[index] = result.unmatchedJumps;
                // Add to the offset.
                offset += result.bytecode.length / 2;
                // Return the bytecode
                return result.bytecode;
            }
            // We're parsing an opcodes.
            case types_1.OperationType.OPCODE: {
                // An opcode is a single byte of data.
                offset += 1;
                // Return the opcode value.
                return opcodes_1["default"][operation.value];
            }
            // We're parsing a push operation.
            case types_1.OperationType.PUSH: {
                // Get the push value.
                var push = "".concat(operation.value).concat(operation.args[0]);
                // Add to the offset.
                offset += push.length / 2;
                // Return the bytecode.
                return "".concat(operation.value).concat(operation.args[0]);
            }
            // We're parsing a codesize call.
            case types_1.OperationType.CODESIZE: {
                // Calculate the code of the macro.
                var code = (0, exports.processMacro)(operation.value, offset, operation.args, macros, constants, jumptables).bytecode;
                // Calculate the length.
                var length_1 = (0, bytes_1.formatEvenBytes)((code.length / 2).toString(16));
                // Get the push value.
                var push = "".concat((0, bytes_1.toHex)(95 + length_1.length / 2)).concat(length_1);
                // Add to the offset.
                offset += push.length / 2;
                // Return a push operation, that pushes the length to the stack.
                return push;
            }
            // We're parsing a jump label push.
            case types_1.OperationType.PUSH_JUMP_LABEL: {
                // Add to the jumptables
                jumptable[index] = [{ label: operation.value, bytecodeIndex: 0 }];
                // Add to the offset.
                offset += 3;
                // Return the bytecode
                return "".concat(opcodes_1["default"].push2, "xxxx");
            }
            // We're parsing a table start position call.
            case types_1.OperationType.TABLE_START_POSITION: {
                // Add to the tableInstances.
                tableInstances.push({ label: operation.value, bytecodeIndex: offset });
                // Add to the offset.
                offset += 3;
                // Return the bytecode.
                return "".concat(opcodes_1["default"].push2, "xxxx");
            }
            // We're parsing a jumpdest.
            case types_1.OperationType.JUMPDEST: {
                // Add to the jumpindices array.
                jumpindices[operation.value] = offset;
                // Add to the offset.
                offset += 1;
                // Return the bytecode.
                return opcodes_1["default"].jumpdest;
            }
            // Default
            default: {
                throw new Error("Processor: Cannot understand operation ".concat(operation.type, " in ").concat(name, "."));
            }
        }
    });
    // Store the current index.
    var currentIndex = bytecodeOffset;
    // Loop through the code definitions.
    var indices = codes.map(function (bytecode) {
        // Update the current index.
        currentIndex += bytecode.length / 2;
        // Return the index.
        return currentIndex;
    });
    // Add the initial index to the start of the array.
    indices.unshift(bytecodeOffset);
    // Store an array of unmatched jumps.
    var unmatchedJumps = [];
    // Get the absolute bytecode index for each jump label.
    var newBytecode = codes.reduce(function (accumulator, bytecode, index) {
        // Store a formatted version of the bytecode.
        var formattedBytecode = bytecode;
        // Check a jump table exists at this index.
        if (jumptable[index]) {
            // Store the jumps.
            var jumps = jumptable[index];
            // Iterate over the jumps at this index.
            for (var _i = 0, jumps_1 = jumps; _i < jumps_1.length; _i++) {
                var _a = jumps_1[_i], jumplabel = _a.label, bytecodeIndex = _a.bytecodeIndex;
                // If the jumplabel is defined:
                if (jumpindices.hasOwnProperty(jumplabel)) {
                    // Get the absolute bytecode index and pad the value (1 byte).
                    var jumpvalue = (0, bytes_1.padNBytes)((0, bytes_1.toHex)(jumpindices[jumplabel]), 2);
                    // Slice the bytecode to get the code before and after the jump.
                    var before = formattedBytecode.slice(0, bytecodeIndex + 2);
                    var after = formattedBytecode.slice(bytecodeIndex + 6);
                    // Ensure that the jump value is set with a placeholder.
                    if (formattedBytecode.slice(bytecodeIndex + 2, bytecodeIndex + 6) !== "xxxx")
                        throw new Error("Processor: Expected indicies ".concat(bytecodeIndex + 2, " to ").concat(bytecodeIndex + 6, " to be jump location, of ").concat(formattedBytecode));
                    // Insert the jump value.
                    formattedBytecode = "".concat(before).concat(jumpvalue).concat(after);
                }
                // If the jumplabel has not been definied:
                else {
                    // Store the offset.
                    var jumpOffset = (indices[index] - bytecodeOffset) * 2;
                    // Push the jump value to the unmatched jumps array.
                    unmatchedJumps.push({ label: jumplabel, bytecodeIndex: jumpOffset + bytecodeIndex });
                }
            }
        }
        // Return the new bytecode.
        return accumulator + formattedBytecode;
    }, "");
    // Return the result.
    return { bytecode: newBytecode, unmatchedJumps: unmatchedJumps, tableInstances: tableInstances, jumptable: jumptable, jumpindices: jumpindices };
};
exports.processMacro = processMacro;
