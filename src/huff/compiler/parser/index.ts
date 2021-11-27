/* Parse File */
import { getUsedDefinitions, setStoragePointerConstants } from "./definitions";
import parseFile from "./high-level";

/* Utils */
import { removeNonMatching } from "../../utils/helpers/data/bytes";

/**
 * Given a file, generate data to be compiled.
 * @param path The file to parse.
 */
const parse = (path: string) => {
  let [{ macros, constants }, { macros: orderedMacros, constants: orderedConstants }] =
    parseFile(path);
  const { macros: usedMacros, constants: usedConstants } = getUsedDefinitions(
    ["MAIN", "CONSTRUCTOR"],
    {
      macros,
      constants,
      tables: [],
    }
  );

  // Remove non-used functions
  orderedMacros = removeNonMatching(orderedMacros, usedMacros);
  orderedConstants = removeNonMatching(orderedConstants, usedConstants);

  // Set storage pointers
  setStoragePointerConstants(constants, orderedConstants);
};
