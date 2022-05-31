import opcodes from "../evm/opcodes";
import { formatEvenBytes, toHex } from "../utils/bytes";
import { HIGH_LEVEL, MACRO_CODE } from "./syntax/defintions";
import { parseArgs } from "./utils/parsing";
import { isEndOfData, isLiteral } from "./utils/regex";
import { Definitions, Operation, OperationType } from "./utils/types";

/**
 * Parse a macro definition.
 * @param args The arguments passed into the macro.
 */
const parseMacro = (
  macro: string,
  macros: Definitions["data"],
  constants: Definitions["data"],
  jumptables: Definitions["data"]
): Operation[] => {
  // Instantiate variables.
  let operations: Operation[] = [];
  const jumpdests = {};

  // Store a copy of the body and args.
  let input = macros[macro].value;
  const args = macros[macro].args;

  // Loop through the body.
  while (!isEndOfData(input)) {
    let token: string[];

    // Check if we're parsing a macro call.
    if (
      input.match(MACRO_CODE.MACRO_CALL) &&
      !(input.match(MACRO_CODE.MACRO_CALL)![1] || "").startsWith("__")
    ) {
      // Parse the macro call.
      token = input.match(MACRO_CODE.MACRO_CALL);
      const name = token[1];
      const args = token[2] ? parseArgs(token[2]) : [];

      // Ensure the macro exists.
      if (!macros[name]) throw new Error(`Macro ${name} does not exist.`);

      // Add the macro's operations to the macro operations.
      operations.push({
        type: OperationType.MACRO_CALL,
        value: name,
        args: args,
      });
    }

    // Check if we're parsing a constant call.
    else if (input.match(MACRO_CODE.CONSTANT_CALL)) {
      // Parse the constant call.
      token = input.match(MACRO_CODE.CONSTANT_CALL);
      const name = token[1];

      // Add the constant call to the token list.
      operations.push({ type: OperationType.CONSTANT_CALL, value: name, args: [] });
    }

    // Check if we're parsing an argument call
    else if (input.match(MACRO_CODE.ARG_CALL)) {
      // Parse a template call
      token = input.match(MACRO_CODE.ARG_CALL);
      const name = token[1];

      // Verify that template has been defined
      if (!args.includes(name)) throw new Error(`Arg ${name} is not defined`);

      // Add the template call to the token list
      operations.push({ type: OperationType.ARG_CALL, value: name, args: [] });
    }

    // Check if we're parsing a code_size call
    else if (input.match(MACRO_CODE.CODE_SIZE)) {
      // Parse the code_size call.
      token = input.match(MACRO_CODE.CODE_SIZE);
      const templateParams = token[2] ? [token[2]] : [];

      // Add the code_size call to the token list.
      operations.push({ type: OperationType.CODESIZE, value: token[1], args: templateParams });
    }

    // Check if we're parsing a table_size call
    else if (input.match(MACRO_CODE.TABLE_SIZE)) {
      // Parse the table_size call.
      token = input.match(MACRO_CODE.TABLE_SIZE);
      const name = token[1];

      // Verify that the table has been defined.
      if (!jumptables[name]) throw new Error(`Table ${name} is not defined`);

      // Get the size of the table.
      const hex = formatEvenBytes(toHex(jumptables[name].args[1]));

      // Add the table_size call to the token list.
      operations.push({ type: OperationType.PUSH, value: toHex(95 + hex.length / 2), args: [hex] });
    }

    // Check if we're parsing a table_start call.
    else if (input.match(MACRO_CODE.TABLE_START)) {
      // Parse the table start call.
      token = input.match(MACRO_CODE.TABLE_START);

      // Add the table start call to the token list.
      operations.push({ type: OperationType.TABLE_START_POSITION, value: token[1], args: [] });
    }

    // Check if we're parsing a jumplabel.
    else if (
      input.match(MACRO_CODE.JUMP_LABEL) &&
      !constants[input.match(MACRO_CODE.JUMP_LABEL)[1]]
    ) {
      // Parse the jump label.
      token = input.match(MACRO_CODE.JUMP_LABEL);

      // Ensure the label has not been defined.
      if (jumpdests[token[1]]) throw new Error(`Jump label ${token[1]} has already been defined`);

      // Define the jump label.
      jumpdests[token[1]] = true;

      // Add the jump label to the token list.
      operations.push({ type: OperationType.JUMPDEST, value: token[1], args: [] });
    }

    // Check if we're parsing a literal.
    else if (input.match(MACRO_CODE.LITERAL_HEX)) {
      // Parse the value.
      token = input.match(MACRO_CODE.LITERAL_HEX);

      // Format the value.
      const hex = formatEvenBytes(token[1]);

      // Add the literal to the token list.
      operations.push({ type: OperationType.PUSH, value: toHex(95 + hex.length / 2), args: [hex] });
    }

    // Check if we're parsing an opcode.
    else if (input.match(MACRO_CODE.TOKEN) && !constants[input.match(MACRO_CODE.TOKEN)[1]]) {
      // Parse the macro.
      token = input.match(MACRO_CODE.TOKEN);

      // Add the opcode to the token list.
      // The value pushed is dependent on whether it's a jump label
      // or an opcode.
      if (opcodes[token[1]])
        operations.push({ type: OperationType.OPCODE, value: token[1], args: [] });
      else operations.push({ type: OperationType.PUSH_JUMP_LABEL, value: token[1], args: [] });
    }
    // Throw if the value is not parsable.
    else throw new Error("Could not parse input");

    // Slice the input
    input = input.slice(token[0].length);
  }

  return operations;
};

/** Parse argument */
export const parseArgument = (
  input: string,
  macros: Definitions["data"],
  constants: Definitions["data"]
): Definitions["data"] => {
  // If the input is a hex literal:
  if (isLiteral(input)) {
    // Get the bytes value of the operation.
    const value = formatEvenBytes(input.substring(2));

    // Get the push value
    const push = toHex(95 + value.length / 2);

    // Return a macro map with a single macro containing a push operation.
    return {
      [input]: {
        value: "",
        args: [],
        data: [{ type: OperationType.PUSH, value: push, args: [value] }],
      },
    };
  }
  // If the input is an opcode:
  else if (opcodes[input]) {
    // Return a macro map with a single macro contraining an opcode.
    return {
      [input]: {
        value: "",
        args: [],
        data: [{ type: OperationType.OPCODE, value: input, args: [] }],
      },
    };
  }

  // If the input is a macro, return the macros map.
  if (macros[input]) return macros;

  // If the input is a constant:
  if (constants[input]) {
    // Return a macro map with a single macro containing a constant call.
    return {
      [input]: {
        value: "",
        args: [],
        data: [{ type: OperationType.CONSTANT_CALL, value: input, args: [] }],
      },
    };
  }

  // If the input is a jump label:
  else {
    return {
      [input]: {
        value: "",
        args: [],
        data: [{ type: OperationType.PUSH_JUMP_LABEL, value: input, args: [] }],
      },
    };
  }
};

export default parseMacro;
