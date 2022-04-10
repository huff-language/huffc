"use strict";
exports.__esModule = true;
exports.generateAbi = void 0;
/**
 * Generate a contract ABI
 * @param path The path to write the ABI to.
 * @param functions Function definitions map.
 * @param events Event definitions map.
 * @returns Contract ABI.
 */
var generateAbi = function (functions, events) {
    // The ABI array.
    var abi = [];
    // Add the functions to the ABI.
    Object.keys(functions).forEach(function (name) {
        // Get the function definition
        var _a = functions[name].data, inputs = _a.inputs, outputs = _a.outputs, type = _a.type;
        // Push the definition to the ABI.
        abi.push({
            name: name,
            type: "function",
            stateMutability: type,
            payable: type === "payable" ? true : false,
            inputs: inputs.map(function (type) {
                return { name: "", type: type };
            }),
            outputs: outputs.map(function (type) {
                return { name: "", type: type };
            })
        });
    });
    // Add the events to the ABI.
    Object.keys(events).forEach(function (name) {
        // Get the event definition.
        var inputs = events[name].args;
        abi.push({
            name: name,
            type: "event",
            anonymous: false,
            inputs: inputs.map(function (type) {
                var indexed;
                if (type.endsWith(" indexed")) {
                    indexed = true;
                    type = type.replace(" indexed", "");
                }
                return { name: "", type: type, indexed: indexed };
            })
        });
    });
    // Return the ABI.
    return JSON.stringify(abi, null, 2);
};
exports.generateAbi = generateAbi;
