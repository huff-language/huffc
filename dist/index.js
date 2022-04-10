"use strict";
exports.__esModule = true;
var bytes_1 = require("./utils/bytes");
var compiler_1 = require("./compiler/compiler");
var high_level_1 = require("./parser/high-level");
var ethers_1 = require("ethers");
var output_1 = require("./output");
/**
 * Compile a Huff file.
 * @param filePath The path to the file.
 * @param args An array containing the arguments to the macro.
 * @returns The compiled bytecode.
 */
var compile = function (args) {
    // Parse the file and generate definitions.
    var _a = (0, high_level_1.parseFile)(args.filePath), macros = _a.macros, constants = _a.constants, tables = _a.tables, functions = _a.functions, events = _a.events;
    // Generate the contract ABI.
    var abi = args.generateAbi ? (0, output_1.generateAbi)(functions, events) : "";
    // Set storage pointer constants.
    constants.data = (0, high_level_1.setStoragePointerConstants)(["CONSTRUCTOR", "MAIN"], macros.data, constants);
    // Compile the macros.
    var mainBytecode = macros.data["MAIN"]
        ? (0, compiler_1.compileMacro)("MAIN", [], macros.data, constants.data, tables.data)
        : "";
    var constructorBytecode = macros.data["CONSTRUCTOR"]
        ? (0, compiler_1.compileMacro)("CONSTRUCTOR", [], macros.data, constants.data, tables.data)
        : "";
    // Store the sizes of the bytecode.
    var contractLength = mainBytecode.length / 2;
    var constructorLength = constructorBytecode.length / 2;
    // Convert the sizes and offset to bytes.
    var contractSize = (0, bytes_1.padNBytes)((0, bytes_1.toHex)(contractLength), 2);
    var contractCodeOffset = (0, bytes_1.padNBytes)((0, bytes_1.toHex)(13 + constructorLength), 2);
    // push2(contract size) dup1 push2(offset to code) push1(0) codecopy push1(0) return
    var bootstrapCode = "61".concat(contractSize, "8061").concat(contractCodeOffset, "6000396000f3");
    var constructorCode = "".concat(constructorBytecode).concat(bootstrapCode);
    var deployedBytecode = "".concat(constructorCode).concat(mainBytecode).concat(args.constructorArgs ? encodeArgs(args.constructorArgs) : "");
    // Return the bytecode.
    return { bytecode: deployedBytecode, runtimeBytecode: mainBytecode, abi: abi };
};
/**
 * Encode arguments.
 * @param args The arguments to encode.
 * @returns The encoded arguments.
 */
function encodeArgs(args) {
    // Instantiate two arrays.
    var types = [];
    var values = [];
    // Split the array of arguments into arrays of types and values.
    args.forEach(function (arg) {
        types.push(arg.type);
        values.push(arg.value);
    });
    // Encode and array the types and values.
    var abiCoder = new ethers_1.ethers.utils.AbiCoder();
    return abiCoder.encode(types, values).replace(/^(0x)/, "");
}
// Export compiler function as default.
exports["default"] = compile;
