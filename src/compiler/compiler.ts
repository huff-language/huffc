import { Definitions } from "../parser/utils/types";
import { formatEvenBytes, padNBytes, toHex } from "../utils/bytes";
import { processMacro } from "./processor";

/**
 * Compile a macro into raw EVM bytecode.
 * @param name The name of the macro.
 * @param args An array of arguments passed into the macro.
 * @param macros Maps all macros to their raw text and arguments.
 * @param constants Maps all constants to their values.
 * @param jumptables Maps all jump tables to their jump values.
 */
export const compileMacro = (
  name: string,
  args: string[],
  macros: Definitions["data"],
  constants: Definitions["data"],
  jumptables: Definitions["data"]
) => {
  // Process the macro and generate semi-complete EVM bytecode.
  let { bytecode, unmatchedJumps, tableInstances, jumptable, jumpindices } = processMacro(
    name,
    0,
    args,
    macros,
    constants,
    jumptables
  );

  // Ensure that there are no unmatched jumps.
  if (unmatchedJumps.length > 0) {
    throw new Error(
      `Compiler: Macro ${name} contains unmatched jump labels ${unmatchedJumps
        .map((jump) => jump.label)
        .join(" ")}, cannot compile`
    );
  }

  // Instantiate variables
  let tableBytecodeOffset = bytecode.length / 2;
  const tableOffsets = {};

  // Iterate over the jumptables.
  Object.keys(jumptables).forEach((jumpkey: string) => {
    // Get the jump table value.
    const table = jumptables[jumpkey];

    // Store the table code.
    let tableCode;

    // Store the jumps and size.
    const [jumps, size] = table.args;

    // tableOffsets[name] = tableBytecodeOffset;
    tableOffsets[table.data[0]] = tableBytecodeOffset;

    // Incerment the table offset.
    tableBytecodeOffset += size;

    // Iterate through the jumplabels.
    tableCode = table.args[0]
      .map((jumplabel) => {
        // If the label has not been defined, return "".
        if (!jumpindices[jumplabel]) return "";

        // Otherwise, set the offset to the jumpindice.
        const offset = jumpindices[jumplabel];
        const hex = formatEvenBytes(toHex(offset));

        // If the table has been compressed.
        if (!table.data[1]) {
          return padNBytes(hex, 0x20);
        } else {
          return padNBytes(hex, 0x02);
        }
      })
      .join("");

    bytecode += tableCode;
  });

  // Remove table instance placeholders.
  tableInstances.forEach((instance) => {
    // Store the name and offset of the instance.
    const { label: name, bytecodeIndex: offset } = instance;

    // Ensure the table has been defined.
    if (!tableOffsets[name]) {
      throw new Error(`Expected to find ${instance.label} in ${JSON.stringify(tableOffsets)}`);
    }

    // Slice the bytecode to get the code before and after the offset.
    const before = bytecode.slice(0, offset * 2 + 2);
    const after = bytecode.slice(offset * 2 + 6);

    // Insert the offset value.
    bytecode = `${before}${padNBytes(toHex(tableOffsets[name]), 2)}${after}`;
  });

  return bytecode;
};
