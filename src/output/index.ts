import fs = require("fs");
import { Definitions } from "../parser/utils/types";

/**
 * Generate a contract ABI
 * @param path The path to write the ABI to.
 * @param functions Function definitions map.
 * @param events Event definitions map.
 * @returns Contract ABI.
 */
export const generateAbi = (functions: Definitions["data"], events: Definitions["data"]) => {
  // The ABI array.
  const abi = [];

  // Add the functions to the ABI.
  Object.keys(functions).forEach((name) => {
    // Get the function definition
    const { inputs, outputs, type } = functions[name].data;

    // Push the definition to the ABI.
    abi.push({
      name: name,
      type: "function",
      stateMutability: type,
      payable: type === "payable" ? true : false,
      inputs: inputs.map((type) => {
        return { name: "", type };
      }),
      outputs: outputs.map((type) => {
        return { name: "", type };
      }),
    });
  });

  // Add the events to the ABI.
  Object.keys(events).forEach((name) => {
    // Get the event definition.
    const inputs = events[name].args;

    abi.push({
      name: name,
      type: "event",
      anonymous: false,
      inputs: inputs.map((type) => {
        let indexed;
        if (type.endsWith(" indexed")) {
          indexed = true;
          type = type.replace(" indexed", "");
        }

        return { name: "", type, indexed };
      }),
    });
  });

  // Return the ABI.
  return JSON.stringify(abi, null, 2);
};
