import opcodes from "../evm/opcodes";
import { parseArgument } from "../parser/macros";
import { Definitions, Operation, OperationType } from "../parser/utils/types";
import { formatEvenBytes, padNBytes, toHex } from "../utils/bytes";

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
export const processMacro = (
  name: string,
  bytecodeOffset: number,
  args: string[],
  macros: Definitions["data"],
  constants: Definitions["data"],
  jumptables: Definitions["data"]
): any => {
  // Check if the macro exists.
  const macro = macros[name];
  if (!macro) throw new Error(`Processor: Failed to find ${macro}.`);

  // Map argument names to values.
  const params: { [name: string]: string } = {};
  macro.args.forEach((arg, index) => {
    params[arg] = args[index];
  });

  // Instantiate variables.
  const jumptable = [];
  let jumpindices: { [name: string]: number } = {};
  let tableInstances: any[] = [];
  let offset: number = bytecodeOffset;

  // Store a copy of the body and args.
  const codes = macro.data.map((operation: Operation, index: number) => {
    switch (operation.type) {
      // We're parsing a macro call.
      case OperationType.MACRO_CALL: {
        // Replace macro arguments with their values.
        operation.args.map((arg: string, index: number) => {
          if (arg.startsWith("<") && arg.endsWith(">")) operation.args[index] = args[index];
        });

        // Process the macro call.
        const result = processMacro(
          operation.value,
          offset,
          operation.args,
          macros,
          constants,
          jumptables
        );

        // Add the result to local variables.
        tableInstances = [...tableInstances, ...result.tableInstances];
        jumptable[index] = result.jumptable = result.unmatchedJumps;
        jumpindices = { ...jumpindices, ...result.jumpindices };

        // Add to the offset.
        offset += result.bytecode.length / 2;

        // Return the result.
        return result.bytecode;
      }
      // We're parsing a constant call.
      case OperationType.CONSTANT_CALL: {
        // Get the value of the constant.
        const value = constants[operation.value].value;

        // Get the push value
        const push = `${toHex(95 + value.length / 2)}${value}`;

        // Add to the offset.
        offset += push.length / 2;

        // Return the bytecode
        return push;
      }
      // We're parsing an argument call.
      case OperationType.ARG_CALL: {
        // Get the value of the argument.
        const arg = params[operation.value];

        // Parse the arguments.
        const result = processMacro(
          arg,
          offset,
          operation.args,
          parseArgument(arg, macros, constants),
          constants,
          jumptables
        );

        // Set the jumplabels to the macro's unmatched jumps.
        jumptable[index] = result.unmatchedJumps;

        // Add to the offset.
        offset += result.bytecode.length / 2;

        // Return the bytecode
        return result.bytecode;
      }
      // We're parsing an opcodes.
      case OperationType.OPCODE: {
        // An opcode is a single byte of data.
        offset += 1;

        // Return the opcode value.
        return opcodes[operation.value];
      }
      // We're parsing a push operation.
      case OperationType.PUSH: {
        // Get the push value.
        const push = `${operation.value}${operation.args[0]}`;

        // Add to the offset.
        offset += push.length / 2;

        // Return the bytecode.
        return `${operation.value}${operation.args[0]}`;
      }
      // We're parsing a codesize call.
      case OperationType.CODESIZE: {
        // Calculate the code of the macro.
        const code = processMacro(
          operation.value,
          offset,
          operation.args,
          macros,
          constants,
          jumptables
        ).bytecode;

        // Calculate the length.
        const length = formatEvenBytes((code.length / 2).toString(16));

        // Get the push value.
        const push = `${toHex(95 + length.length / 2)}${length}`;

        // Add to the offset.
        offset += push.length / 2;

        // Return a push operation, that pushes the length to the stack.
        return push;
      }
      // We're parsing a jump label push.
      case OperationType.PUSH_JUMP_LABEL: {
        // Add to the jumptables
        jumptable[index] = [{ label: operation.value, bytecodeIndex: 0 }];

        // Add to the offset.
        offset += 3;

        // Return the bytecode
        return `${opcodes.push2}xxxx`;
      }
      // We're parsing a table start position call.
      case OperationType.TABLE_START_POSITION: {
        // Add to the tableInstances.
        tableInstances.push({ label: operation.value, bytecodeIndex: offset });

        // Add to the offset.
        offset += 3;

        // Return the bytecode.
        return `${opcodes.push2}xxxx`;
      }
      // We're parsing a jumpdest.
      case OperationType.JUMPDEST: {
        // Add to the jumpindices array.
        jumpindices[operation.value] = offset;

        // Add to the offset.
        offset += 1;

        // Return the bytecode.
        return opcodes.jumpdest;
      }
      // Default
      default: {
        throw new Error(`Processor: Cannot understand operation ${operation.type} in ${name}.`);
      }
    }
  });

  // Store the current index.
  let currentIndex = bytecodeOffset;

  // Loop through the code definitions.
  const indices = codes.map((bytecode) => {
    // Update the current index.
    currentIndex += bytecode.length / 2;

    // Return the index.
    return currentIndex;
  });

  // Add the initial index to the start of the array.
  indices.unshift(bytecodeOffset);

  // Store an array of unmatched jumps.
  const unmatchedJumps = [];

  // Get the absolute bytecode index for each jump label.
  const newBytecode = codes.reduce((accumulator, bytecode, index) => {
    // Store a formatted version of the bytecode.
    let formattedBytecode = bytecode;

    // Check a jump table exists at this index.
    if (jumptable[index]) {
      // Store the jumps.
      const jumps = jumptable[index];

      // Iterate over the jumps at this index.
      for (const { label: jumplabel, bytecodeIndex } of jumps) {
        // If the jumplabel is defined:
        if (jumpindices.hasOwnProperty(jumplabel)) {
          // Get the absolute bytecode index and pad the value (1 byte).
          const jumpvalue = padNBytes(toHex(jumpindices[jumplabel]), 2);

          // Slice the bytecode to get the code before and after the jump.
          const before = formattedBytecode.slice(0, bytecodeIndex + 2);
          const after = formattedBytecode.slice(bytecodeIndex + 6);

          // Ensure that the jump value is set with a placeholder.
          if (formattedBytecode.slice(bytecodeIndex + 2, bytecodeIndex + 6) !== "xxxx")
            throw new Error(
              `Processor: Expected indicies ${bytecodeIndex + 2} to ${
                bytecodeIndex + 6
              } to be jump location, of ${formattedBytecode}`
            );

          // Insert the jump value.
          formattedBytecode = `${before}${jumpvalue}${after}`;
        }
        // If the jumplabel has not been definied:
        else {
          // Store the offset.
          const jumpOffset = (indices[index] - bytecodeOffset) * 2;

          // Push the jump value to the unmatched jumps array.
          unmatchedJumps.push({ label: jumplabel, bytecodeIndex: jumpOffset + bytecodeIndex });
        }
      }
    }

    // Return the new bytecode.
    return accumulator + formattedBytecode;
  }, "");

  // Return the result.
  return { bytecode: newBytecode, unmatchedJumps, tableInstances, jumptable, jumpindices };
};
