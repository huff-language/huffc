/* Parser */
import { getUsedDefinitions, setStoragePointerConstants } from "./definitions";
import parseFile from "./high-level";

/* Utils */
import { removeNonMatching } from "../../utils/helpers/data/bytes";

/**
 * Given a file, generate data to be compiled.
 * @param path The file to parse.
 */
const parse = (
  path: string
): {
  macros: { [name: string]: { args: number; body: string } };
  constants: { [name: string]: string };
} => {
  // Generate arrays containing all macros, constants, and tables.
  let [{ macros, constants }, { macros: orderedMacros, constants: orderedConstants }] =
    parseFile(path);

  // Get an array of used storage pointers.
  const { macros: usedMacros, constants: usedConstants } = getUsedDefinitions(
    ["MAIN", "CONSTRUCTOR"],
    {
      macros,
      constants,
      tables: [],
    }
  );

  // Remove non-used functions.
  orderedMacros = removeNonMatching(orderedMacros, usedMacros);
  orderedConstants = removeNonMatching(orderedConstants, usedConstants);

  // Set the value of constants that use "FREE_MEMORY_POINTER()".
  setStoragePointerConstants(constants, orderedConstants);

  // Return the data.
  return { macros, constants };
};

export default parse;
