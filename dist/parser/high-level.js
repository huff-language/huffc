"use strict";
exports.__esModule = true;
exports.setStoragePointers = exports.setStoragePointerConstants = exports.parseFile = void 0;
var contents_1 = require("./utils/contents");
var regex_1 = require("./utils/regex");
var defintions_1 = require("./syntax/defintions");
var parsing_1 = require("./utils/parsing");
var tables_1 = require("./tables");
var macros_1 = require("./macros");
var bytes_1 = require("../utils/bytes");
/**
 * Parse a file, storing the definitions of all constants, macros, and tables.
 * @param filePath The path to the file to parse.
 */
var parseFile = function (filePath) {
    // Get an array of file contents.
    var fileContents = (0, contents_1["default"])(filePath);
    // Extract information.
    var contents = fileContents.contents;
    var imports = fileContents.imports;
    // Set defintion variables.
    var macros = { data: {}, defintions: [] };
    var constants = { data: {}, defintions: [] };
    var tables = { data: {}, defintions: [] };
    // Set output variables.
    var functions = {};
    var events = {};
    // Parse the file contents.
    contents.forEach(function (content, contentIndex) {
        var input = content;
        while (!(0, regex_1.isEndOfData)(input)) {
            // Check if we are parsing a macro definition.
            if (defintions_1.HIGH_LEVEL.MACRO.test(input)) {
                // Parse macro definition
                var macro = input.match(defintions_1.HIGH_LEVEL.MACRO);
                // Add the macro to the macros array.
                macros.defintions.push(macro[2]);
                // macros[name] = body, args.
                macros.data[macro[2]] = { value: macro[7], args: (0, parsing_1.parseArgs)(macro[3]) };
                // Parse the macro.
                macros.data[macro[2]].data = (0, macros_1["default"])(macro[2], macros.data, constants.data, tables.data);
                // Slice the input
                input = input.slice(macro[0].length);
            }
            // Check if we are parsing an import.
            else if (defintions_1.HIGH_LEVEL.IMPORT.test(input)) {
                input = input.slice(input.match(defintions_1.HIGH_LEVEL.IMPORT)[0].length);
            }
            // Check if we are parsing a constant definition.
            else if (defintions_1.HIGH_LEVEL.CONSTANT.test(input)) {
                // Parse constant definition.
                var constant = input.match(defintions_1.HIGH_LEVEL.CONSTANT);
                var name_1 = constant[2];
                var value = constant[3].replace("0x", "");
                // Ensure that the constant name is all uppercase.
                if (name_1.toUpperCase() !== name_1)
                    throw new SyntaxError("ParserError at ".concat(imports[contentIndex], " (Line ").concat((0, parsing_1.getLineNumber)(input, content), "): Constant ").concat(name_1, " must be uppercase."));
                // Store the constant.
                constants.defintions.push(name_1);
                constants.data[name_1] = { value: value, args: [] };
                // Slice the input.
                input = input.slice(constant[0].length);
            }
            // Check if we are parsing a function definition.
            else if (defintions_1.HIGH_LEVEL.FUNCTION.test(input)) {
                // Parse the function definition.
                var functionDef = input.match(defintions_1.HIGH_LEVEL.FUNCTION);
                // Calculate the hash of the function definition and store the first 4 bytes.
                // This is the signature of the function.
                var name_2 = functionDef[2];
                // Store the input and output strings.
                var inputs = functionDef[3];
                var outputs = functionDef[5];
                // Store the function values.
                var definition = {
                    inputs: inputs ? (0, parsing_1.parseArgs)(inputs) : [],
                    outputs: outputs ? (0, parsing_1.parseArgs)(functionDef[5]) : [],
                    type: functionDef[4]
                };
                // Store the function definition.
                functions[name_2] = { value: name_2, args: [], data: definition };
                // Slice the input.
                input = input.slice(functionDef[0].length);
            }
            // Check if we're parsing an event defintion.
            else if (defintions_1.HIGH_LEVEL.EVENT.test(input)) {
                // Parse the event definition.
                var eventDef = input.match(defintions_1.HIGH_LEVEL.EVENT);
                // Calculate the hash of the event definition and store the first 4 bytes.
                // This is the signature of the event.
                var name_3 = eventDef[2];
                // Store the args.
                var args = (0, parsing_1.parseArgs)(eventDef[3]).map(function (arg) { return arg.replace("indexed", " indexed"); });
                // Store the event definition.
                events[name_3] = { value: name_3, args: args };
                // Slice the input.
                input = input.slice(eventDef[0].length);
            }
            // Check if we're parsing a code table definition.
            else if (defintions_1.HIGH_LEVEL.CODE_TABLE.test(input)) {
                // Parse the table definition.
                var table = input.match(defintions_1.HIGH_LEVEL.CODE_TABLE);
                var body = table[3];
                // Parse the table.
                var parsed = (0, tables_1.parseCodeTable)(body);
                // Store the table definition.
                tables.defintions.push(table[2]);
                tables.data[table[2]] = { value: body, args: [parsed.table, parsed.size] };
                // Slice the input
                input = input.slice(table[0].length);
            }
            // Check if we're parsing a packed table definition.
            else if (defintions_1.HIGH_LEVEL.JUMP_TABLE_PACKED.test(input)) {
                // Parse the table definition.
                var table = input.match(defintions_1.HIGH_LEVEL.JUMP_TABLE_PACKED);
                var type = table[1];
                // Ensure the type is valid.
                if (type !== "jumptable__packed")
                    throw new SyntaxError("ParserError at ".concat(imports[contentIndex], " (Line ").concat((0, parsing_1.getLineNumber)(input, content), "): Table ").concat(table[0], " has invalid type: ").concat(type));
                // Parse the table.
                var body = table[3];
                var parsed = (0, tables_1.parseJumpTable)(body, true);
                // Store the table definition.
                tables.defintions.push(table[2]);
                tables.data[table[2]] = {
                    value: body,
                    args: [parsed.jumps, parsed.size],
                    data: [table[2], true]
                };
                // Slice the input.
                input = input.slice(table[0].length);
            }
            // Check if we're parsing a jump table definition.
            else if (defintions_1.HIGH_LEVEL.JUMP_TABLE.test(input)) {
                // Parse the table definition.
                var table = input.match(defintions_1.HIGH_LEVEL.JUMP_TABLE);
                var type = table[1];
                // Ensure the type is valid.
                if (type !== "jumptable")
                    throw new SyntaxError("ParserError at ".concat(imports[contentIndex], " (Line ").concat((0, parsing_1.getLineNumber)(input, content), "): Table ").concat(table[0], " has invalid type: ").concat(type));
                // Parse the table.
                var body = table[3];
                var parsed = (0, tables_1.parseJumpTable)(body, false);
                // Store the table definition.
                tables.defintions.push(table[2]);
                tables.data[table[2]] = {
                    value: body,
                    args: [parsed.jumps, parsed.size],
                    data: [table[2], false]
                };
                // Slice the input.
                input = input.slice(table[0].length);
            }
            else {
                // Get the index of the current input.
                var index = content.indexOf(input);
                // Get the line number of the file.
                var lineNumber = content.substring(0, index).split("\n").length;
                // Raise error.
                throw new SyntaxError("ParserError at ".concat(imports[contentIndex], "(Line ").concat(lineNumber, "): Invalid Syntax\n          \n          ").concat(input.slice(0, input.indexOf("\n")), "\n          ^\n          "));
            }
        }
    });
    // Return all values
    return { macros: macros, constants: constants, functions: functions, events: events, tables: tables };
};
exports.parseFile = parseFile;
var setStoragePointerConstants = function (macrosToSearch, macros, constants) {
    // Array of used storage pointer constants.
    var usedStoragePointerConstants = [];
    // Define a functinon that iterates over all macros and adds the storage pointer constants.
    var getUsedStoragePointerConstants = function (name, revertIfNonExistant) {
        // Store macro.
        var macro = macros[name];
        // Check if the macro exists.
        if (!macro) {
            // Check if we should revert (and revert).
            if (revertIfNonExistant)
                throw new Error("Macro ".concat(name, " does not exist"));
            // Otherwise just return.
            return;
        }
        // Store the macro body.
        var body = macros[name].value;
        while (!(0, regex_1.isEndOfData)(body)) {
            // If the next call is a constant call.
            if (body.match(defintions_1.MACRO_CODE.CONSTANT_CALL)) {
                // Store the constant definition.
                var definition = body.match(defintions_1.MACRO_CODE.CONSTANT_CALL);
                var constantName = definition[1];
                // Push the array to the usedStoragePointerConstants array.
                if (constants.data[constantName].value === "FREE_STORAGE_POINTER()" &&
                    !usedStoragePointerConstants.includes(constantName)) {
                    usedStoragePointerConstants.push(constantName);
                }
                // Slice the body.
                body = body.slice(definition[0].length);
            }
            // If the next call is a macro call.
            else if (body.match(defintions_1.MACRO_CODE.MACRO_CALL)) {
                // Store the macro definition.
                var definition = body.match(defintions_1.MACRO_CODE.MACRO_CALL);
                var macroName = definition[1];
                // Get the used storage pointer constants.
                getUsedStoragePointerConstants(macroName, true);
                // Slice the body.
                body = body.slice(definition[0].length);
            }
            // Otherwise just slice the body by one.
            else {
                body = body.slice(1);
            }
        }
    };
    // Loop through the given macros and generate the used storage pointer constants.
    macrosToSearch.forEach(function (macroName) {
        getUsedStoragePointerConstants(macroName, false);
    });
    // Iterate through the ordered pointers and generate
    // an array (ordered by the defined order) of all storage pointer constants.
    var orderedStoragePointerConstants = constants.defintions.filter(function (constant) {
        return usedStoragePointerConstants.includes(constant);
    });
    // Update and return the constants map.
    return (0, exports.setStoragePointers)(constants.data, orderedStoragePointerConstants);
};
exports.setStoragePointerConstants = setStoragePointerConstants;
/**
 * Assign constants that use the builtin FREE_STORAGE_POINTER(
 * @param constants Maps the name of constants to their values
 * @param order The order that the constants were declared in
 */
var setStoragePointers = function (constants, order) {
    var usedPointers = [];
    // Iterate over the array of constants.
    order.forEach(function (name) {
        var value = constants[name].value;
        // If the value is a hex literal.
        if (!value.startsWith("FREE_")) {
            /*
              If the pointer is already used, throw an error.
              In order to safely circumvent this, all constant-defined pointers must be defined before
              pointers that use FREE_STORAGE_POINTER.
              */
            if (usedPointers.includes((0, bytes_1.convertBytesToNumber)(value))) {
                throw "Constant ".concat(name, " uses already existing pointer");
            }
            // Add the pointer to the list of used pointers.
            usedPointers.push((0, bytes_1.convertBytesToNumber)(value));
        }
        // The value calls FREE_STORAGE_POINTER.
        else if (value == "FREE_STORAGE_POINTER()") {
            // Find the lowest available pointer value.
            var pointer = (0, bytes_1.findLowest)(0, usedPointers);
            // Add the pointer to the list of used pointers.
            usedPointers.push(pointer);
            // Set the constant to the pointer value.
            constants[name].value = (0, bytes_1.convertNumberToBytes)(pointer).replace("0x", "");
        }
    });
    // Return the new constants value.
    return constants;
};
exports.setStoragePointers = setStoragePointers;
