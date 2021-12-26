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
