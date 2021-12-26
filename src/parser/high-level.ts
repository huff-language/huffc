import getAllFileContents from "./utils/contents";

import { isEndOfData } from "./utils/regex";
import { Definitions } from "./utils/types";
import { HIGH_LEVEL } from "./syntax/defintions";
import { parseArgs, getLineNumber } from "./utils/parsing";

import { solidityKeccak256, keccak256, arrayify } from "ethers/lib/utils";
import { parseCodeTable, parseJumpTable } from "./tables";
import parseMacro from "./macros";

/**
 * Parse a file, storing the definitions of all constants, macros, and tables.
 * @param filePath The path to the file to parse.
 */
export const parseFile = (
  filePath: string
): { macros: Definitions; constants: Definitions; functions: Definitions; tables: Definitions } => {
  // Get an array of file contents.
  const contents: string[] = getAllFileContents(filePath);

  // Set variables.
  const macros: Definitions = { data: {}, defintions: [] };
  const constants: Definitions = { data: {}, defintions: [] };
  const functions: Definitions = { data: {}, defintions: [] };
  const tables: Definitions = { data: {}, defintions: [] };

  const errors = [];

  // Parse the file contents.
  contents.forEach((content: string) => {
    let input = content;

    while (!isEndOfData(input)) {
      // Check if we are parsing a macro definition.
      if (HIGH_LEVEL.MACRO.test(input)) {
        // Parse macro definition
        const macro = input.match(HIGH_LEVEL.MACRO);

        // Add the macro to the macros array.
        macros.defintions.push(macro[2]);

        // macros[name] = body, args.
        macros.data[macro[2]] = { value: macro[7], args: parseArgs(macro[3]) };

        // Parse the macro.
        macros.data[macro[2]].data = parseMacro(macro[2], macros.data, tables.data);

        // Slice the input
        input = input.slice(macro[0].length);
      }
      // Check if we are parsing a constant definition.
      else if (HIGH_LEVEL.CONSTANT.test(input)) {
        // Parse constant definition.
        const constant = input.match(HIGH_LEVEL.CONSTANT);
        const name = constant[2];
        const value = constant[3];

        // Ensure that the constant name is all uppercase.
        if (name.toUpperCase() !== name) throw new Error(`Constant ${name} is not uppercase`);

        // Store the constant.
        constants.defintions.push(name);
        constants.data[name] = { value, args: [] };

        // Slice the input.
        input = input.slice(constant[0].length);
      }
      // Check if we are parsing a function definition.
      else if (HIGH_LEVEL.FUNCTION.test(input)) {
        // Parse the function definition.
        const functionDef = input.match(HIGH_LEVEL.FUNCTION);

        // Calculate the hash of the function definition and store the first 4 bytes.
        // This is the signature of the function.
        const name = functionDef[1];
        const hash = solidityKeccak256(["string"], [name]).substring(0, 8);

        console.log(hash);

        // Store the function definition.
        functions.defintions.push(name);
        functions.data[name] = { value: hash, args: parseArgs(functionDef[4]) };

        // Slice the input.
        input = input.slice(functionDef[0].length);
      }
      // Check if we're parsing a code table definition.
      else if (HIGH_LEVEL.CODE_TABLE.test(input)) {
        // Parse the table definition.
        const table = input.match(HIGH_LEVEL.CODE_TABLE);
        const body = table[3];

        // Parse the table.
        const parsed = parseCodeTable(body);

        // Store the table definition.
        tables.defintions.push(table[2]);
        tables.data[table[2]] = { value: body, args: [parsed.table, parsed.size] };

        // Slice the input
        input = input.slice(table[0].length);
      }

      // Check if we're parsing a packed table definition.
      else if (HIGH_LEVEL.JUMP_TABLE_PACKED.test(input)) {
        // Parse the table definition.
        const table = input.match(HIGH_LEVEL.JUMP_TABLE_PACKED);
        const type = table[1];

        // Ensure the type is valid.
        if (type !== "jumptable__packed")
          errors.push(
            `Error at line ${getLineNumber(
              input,
              content.indexOf(input)
            )}: Invalid type ${type} \n ${table[0]}`
          );

        // Parse the table.
        const body = table[3];
        const parsed = parseJumpTable(body, true);

        // Store the table definition.
        tables.defintions.push(table[2]);
        tables.data[table[2]] = { value: body, args: [parsed.jumps, parsed.size] };

        // Slice the input.
        input = input.slice(table[0].length);
      }

      // Check if we're parsing a jump table definition.
      else if (HIGH_LEVEL.JUMP_TABLE.test(input)) {
        // Parse the table definition.
        const table = input.match(HIGH_LEVEL.JUMP_TABLE);
        const type = table[1];

        // Ensure the type is valid.
        if (type !== "jumptable")
          errors.push(
            `Error at line ${getLineNumber(
              input,
              content.indexOf(input)
            )}: Invalid type ${type} \n ${table[0]}`
          );

        // Parse the table.
        const body = table[3];
        const parsed = parseJumpTable(body, false);

        // Store the table definition.
        tables.defintions.push(table[2]);
        tables.data[table[2]] = { value: body, args: [parsed.jumps, parsed.size] };

        // Slice the input.
        input = input.slice(table[0].length);
      } else {
        // Index of the next line break.
        const index = input.indexOf("\n");

        // If the index exists, slice the input.
        if (index !== -1) {
          input = input.slice(index);
        }
      }
    }
  });

  // Return all values
  return { macros, constants, functions, tables };
};
