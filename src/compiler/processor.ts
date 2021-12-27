import opcodes from "../evm/opcodes";
import { Definitions, Operation, OperationType } from "../parser/utils/types";
import { formatEvenBytes, toHex } from "../utils/bytes";

export const processMacro = (
  name: string,
  args: string[],
  macros: Definitions["data"],
  constants: Definitions["data"],
  jumptables: Definitions["data"]
): any => {
  // Check if the macro exists.
  const macro = macros[name];
  if (!macro) throw new Error(`Macro ${macro} does not exist.`);

  // Map argument names to values.
  const params: { [name: string]: string } = {};
  macro.args.forEach((arg, index) => {
    params[arg] = args[index];
  });

  // Instantiate variables.
  const jumptable = [];
  let jumpindices: { [name: string]: number } = {};
  let tableInstances: any[] = [];
  let offset: number = 0;

  // Store a copy of the body and args.
  const codes = macro.data.map((operation: Operation, index: number) => {
    switch (operation.type) {
      // We're parsing a macro call.
      case OperationType.MACRO_CALL: {
        // Process the macro call.
        const result = processMacro(operation.value, operation.args, macros, constants, jumptables);

        // Add the result to local variables.
        tableInstances = [...tableInstances, ...result.tableInstances];
        jumptable[index] = result.jumptable = result.unmatchedJumps;
        jumpindices = { ...jumpindices, ...result.jumpindices };

        // Add to the offset.
        offset += result.bytecode.length;

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
        // Get the bytes value of the operation.
        const value = params[operation.value].substring(2);

        // Get the push value
        const push = `${toHex(95 + value.length / 2)}${value}`;

        // Add to the offset.
        offset += push.length / 2;

        // Return the bytecode
        return push;
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
        tableInstances.push({ lable: operation.value, bytecodeIndex: offset });

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
        throw new Error(`Operation ${operation.type} does not exist.`);
      }
    }
  });

  // Return the result.
  return { bytecode: codes.join(""), tableInstances, jumptable, jumpindices };
};
