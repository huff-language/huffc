import { JUMP_TABLES } from "./syntax/defintions";
import { removeSpacesAndLines } from "./utils/regex";

/**
 * Parse a code table definition
 * @param body The raw string representing the body of the table.
 */
export const parseCodeTable = (body: string): { table: string; size: number } => {
  // Parse the body of the table.
  const table = body
    .match(JUMP_TABLES.JUMPS)
    .map((jump) => {
      return removeSpacesAndLines(jump);
    })
    .join("");

  // Return the table data.
  return { table, size: table.length / 2 };
};

/**
 * Parse a jumptable definition
 * @param body The raw string representing the body of the table.
 */
export const parseJumpTable = (
  body: string,
  compressed = false
): { jumps: string[]; size: number } => {
  // Parse the body of the table
  const jumps = body.match(JUMP_TABLES.JUMPS).map((jump) => {
    return removeSpacesAndLines(jump);
  });

  // Calculate the size of the table.
  let size;
  if (compressed) size = jumps.length * 0x02;
  else size = jumps.length * 0x20;

  // Return the array of jumps and the size of the table.
  return {
    jumps,
    size,
  };
};
