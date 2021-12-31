"use strict";
exports.__esModule = true;
exports.parseArgument = void 0;
var opcodes_1 = require("../evm/opcodes");
var bytes_1 = require("../utils/bytes");
var defintions_1 = require("./syntax/defintions");
var parsing_1 = require("./utils/parsing");
var regex_1 = require("./utils/regex");
var types_1 = require("./utils/types");
/**
 * Parse a macro definition.
 * @param args The arguments passed into the macro.
 */
var parseMacro = function (macro, macros, constants, jumptables) {
    // Instantiate variables.
    var operations = [];
    var jumpdests = {};
    // Store a copy of the body and args.
    var input = macros[macro].value;
    var args = macros[macro].args;
    // Loop through the body.
    while (!(0, regex_1.isEndOfData)(input)) {
        var token = void 0;
        // Check if we're parsing a macro call.
        if (input.match(defintions_1.MACRO_CODE.MACRO_CALL) &&
            !(input.match(defintions_1.MACRO_CODE.MACRO_CALL) ? input.match(defintions_1.MACRO_CODE.MACRO_CALL)[1] : "").startsWith("__")) {
            // Parse the macro call.
            token = input.match(defintions_1.MACRO_CODE.MACRO_CALL);
            var name_1 = token[1];
            var args_1 = token[2] ? (0, parsing_1.parseArgs)(token[2]) : [];
            // Ensure the macro exists.
            if (!macros[name_1])
                throw new Error("Macro ".concat(name_1, " does not exist."));
            // Add the macro's operations to the macro operations.
            operations.push({
                type: types_1.OperationType.MACRO_CALL,
                value: name_1,
                args: args_1
            });
        }
        // Check if we're parsing a constant call.
        else if (input.match(defintions_1.MACRO_CODE.CONSTANT_CALL)) {
            // Parse the constant call.
            token = input.match(defintions_1.MACRO_CODE.CONSTANT_CALL);
            var name_2 = token[1];
            // Add the constant call to the token list.
            operations.push({ type: types_1.OperationType.CONSTANT_CALL, value: name_2, args: [] });
        }
        // Check if we're parsing an argument call
        else if (input.match(defintions_1.MACRO_CODE.ARG_CALL)) {
            // Parse a template call
            token = input.match(defintions_1.MACRO_CODE.ARG_CALL);
            var name_3 = token[1];
            // Verify that template has been defined
            if (!args.includes(name_3))
                throw new Error("Arg ".concat(name_3, " is not defined"));
            // Add the template call to the token list
            operations.push({ type: types_1.OperationType.ARG_CALL, value: name_3, args: [] });
        }
        // Check if we're parsing a code_size call
        else if (input.match(defintions_1.MACRO_CODE.CODE_SIZE)) {
            // Parse the code_size call.
            token = input.match(defintions_1.MACRO_CODE.CODE_SIZE);
            var templateParams = token[2] ? [token[2]] : [];
            // Add the code_size call to the token list.
            operations.push({ type: types_1.OperationType.CODESIZE, value: token[1], args: templateParams });
        }
        // Check if we're parsing a table_size call
        else if (input.match(defintions_1.MACRO_CODE.TABLE_SIZE)) {
            // Parse the table_size call.
            token = input.match(defintions_1.MACRO_CODE.TABLE_SIZE);
            var name_4 = token[1];
            // Verify that the table has been defined.
            if (!jumptables[name_4])
                throw new Error("Table ".concat(name_4, " is not defined"));
            // Get the size of the table.
            var hex = (0, bytes_1.formatEvenBytes)((0, bytes_1.toHex)(jumptables[name_4].value.length));
            // Add the table_size call to the token list.
            operations.push({ type: types_1.OperationType.PUSH, value: (0, bytes_1.toHex)(95 + hex.length / 2), args: [hex] });
        }
        // Check if we're parsing a table_start call.
        else if (input.match(defintions_1.MACRO_CODE.TABLE_START)) {
            // Parse the table start call.
            token = input.match(defintions_1.MACRO_CODE.TABLE_START);
            // Add the table start call to the token list.
            operations.push({ type: types_1.OperationType.TABLE_START_POSITION, value: token[1], args: [] });
        }
        // Check if we're parsing a jumplabel.
        else if (input.match(defintions_1.MACRO_CODE.JUMP_LABEL) &&
            !constants[input.match(defintions_1.MACRO_CODE.JUMP_LABEL)[1]]) {
            // Parse the jump label.
            token = input.match(defintions_1.MACRO_CODE.JUMP_LABEL);
            // Ensure the label has not been defined.
            if (jumpdests[token[1]])
                throw new Error("Jump label ".concat(token[1], " has already been defined"));
            // Define the jump label.
            jumpdests[token[1]] = true;
            // Add the jump label to the token list.
            operations.push({ type: types_1.OperationType.JUMPDEST, value: token[1], args: [] });
        }
        // Check if we're parsing a literal.
        else if (input.match(defintions_1.MACRO_CODE.LITERAL_HEX)) {
            // Parse the value.
            token = input.match(defintions_1.MACRO_CODE.LITERAL_HEX);
            // Format the value.
            var hex = (0, bytes_1.formatEvenBytes)(token[1]);
            // Add the literal to the token list.
            operations.push({ type: types_1.OperationType.PUSH, value: (0, bytes_1.toHex)(95 + hex.length / 2), args: [hex] });
        }
        // Check if we're parsing an opcode.
        else if (input.match(defintions_1.MACRO_CODE.TOKEN) && !constants[input.match(defintions_1.MACRO_CODE.TOKEN)[1]]) {
            // Parse the macro.
            token = input.match(defintions_1.MACRO_CODE.TOKEN);
            // Add the opcode to the token list.
            // The value pushed is dependent on whether it's a jump label
            // or an opcode.
            if (opcodes_1["default"][token[1]])
                operations.push({ type: types_1.OperationType.OPCODE, value: token[1], args: [] });
            else
                operations.push({ type: types_1.OperationType.PUSH_JUMP_LABEL, value: token[1], args: [] });
        }
        // Throw if the value is not parsable.
        else
            throw new Error("Could not parse input");
        // Slice the input
        input = input.slice(token[0].length);
    }
    return operations;
};
/** Parse argument */
var parseArgument = function (input, macros, constants) {
    var _a, _b, _c, _d;
    // If the input is a hex literal:
    if ((0, regex_1.isLiteral)(input)) {
        // Get the bytes value of the operation.
        var value = input.substring(2);
        // Get the push value
        var push = (0, bytes_1.toHex)(95 + value.length / 2);
        // Return a macro map with a single macro containing a push operation.
        return _a = {},
            _a[input] = {
                value: "",
                args: [],
                data: [{ type: types_1.OperationType.PUSH, value: push, args: [value] }]
            },
            _a;
    }
    // If the input is an opcode:
    else if (opcodes_1["default"][input]) {
        // Return a macro map with a single macro contraining an opcode.
        return _b = {},
            _b[input] = {
                value: "",
                args: [],
                data: [{ type: types_1.OperationType.OPCODE, value: input, args: [] }]
            },
            _b;
    }
    // If the input is a macro, return the macros map.
    if (macros[input])
        return macros;
    // If the input is a constant:
    if (constants[input]) {
        // Return a macro map with a single macro containing a constant call.
        return _c = {},
            _c[input] = {
                value: "",
                args: [],
                data: [{ type: types_1.OperationType.CONSTANT_CALL, value: input, args: [] }]
            },
            _c;
    }
    // If the input is a jump label:
    else {
        return _d = {},
            _d[input] = {
                value: "",
                args: [],
                data: [{ type: types_1.OperationType.PUSH_JUMP_LABEL, value: input, args: [] }]
            },
            _d;
    }
};
exports.parseArgument = parseArgument;
exports["default"] = parseMacro;
