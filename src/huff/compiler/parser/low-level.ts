/* Parser Utils */
import { Token, TokenType, Definitions } from "../utils/enums";

/* Language Utils */
import { countSpaces, isEndOfData } from "../../utils/helpers/regex";
import { MACRO_CODE } from "../../utils/langauge/syntax";

/* Data Utils */
import { formatEvenBytes, convertNumberToBytes, toHex } from "../../utils/helpers/data/bytes";

const parseMacros = (toParse: string[], macros: Definitions["macros"]): Token[][] => {
  const macroTokens: Token[][] = [];
  toParse.forEach((macro) => {
    macroTokens.push(macros[macro] ? parseMacro(macro, macros) : []);
  });

  return macroTokens;
};

/**
 * @param macro The name of the macro
 * @param macros Maps macros to their names, args, and raw code data
 * @returns An array containing the macro's parsed code
 */
export const parseMacro = (macro: string, macros: Definitions["macros"]): Token[] => {
  // Set compiler variables
  let body = macros[macro].body;
  const macroArgs = macros[macro].args;

  const tokens: Token[] = [];
  const jumpdests = {};

  // Parse the macro's body
  while (!isEndOfData(body)) {
    let token: any[];

    if (body.match(MACRO_CODE.MACRO_CALL)) {
      // Parse a macro call
      token = body.match(MACRO_CODE.MACRO_CALL);
      const name = token[1];
      const args = token[2] ? [token[2]] : [];

      // Verify that the macro has been defined
      if (!macros[name]) throw new Error(`Macro ${name} is not defined`);

      // Add the macro call to the token list
      tokens.push({ type: TokenType.MACRO_CALL, name, args, ops: parseMacro(name, macros) });
    } else if (body.match(MACRO_CODE.CONSTANT_CALL)) {
      // Parse a constant call
      token = body.match(MACRO_CODE.CONSTANT_CALL);
      const name = token[1];

      // Add the constant call to the token list
      tokens.push({ type: TokenType.CONSTANT_CALL, name, args: [] });
    } else if (body.match(MACRO_CODE.ARG_CALL)) {
      // Parse a template call
      token = body.match(MACRO_CODE.ARG_CALL);
      const name = token[1];

      // Verify that template has been defined
      if (!macroArgs[name]) throw new Error(`Template ${name} is not defined`);

      // Add the template call to the token list
      tokens.push({ type: TokenType.ARG_CALL, name, args: [] });
    } else if (body.match(MACRO_CODE.TOKEN) && !body.match(MACRO_CODE.TOKEN)[1].startsWith("0x")) {
      // Parse am opcode
      token = body.match(MACRO_CODE.TOKEN);
      const name = token[1];

      // Add the opcode to the token list
      tokens.push({ type: TokenType.OPCODE, name, args: [] });
    } else if (body.match(MACRO_CODE.CODE_SIZE)) {
      // Parse a code size call
      token = body.match(MACRO_CODE.CODE_SIZE);

      // Add the code size call to the token list
      token.push({
        type: TokenType.CODESIZE,
        name: token[1],
        args: [],
      });
    } else if (body.match(MACRO_CODE.JUMP_LABEL)) {
      // Parse a jump label
      token = body.match(MACRO_CODE.JUMP_LABEL);

      // Verify that the jump label has not been defined
      if (jumpdests[token[1]]) throw new Error(`Jump label ${token[1]} is already defined`);

      // Add the jump label to the token list
      tokens.push({ type: TokenType.PUSH_JUMP_LABEL, name: token[1], args: [] });

      // Add the jump label to the jump destinations
      jumpdests[token[1]] = true;
    } else if (body.match(MACRO_CODE.LITERAL_HEX)) {
      // Parse a hex literal
      token = body.match(MACRO_CODE.LITERAL_HEX);
      const value = formatEvenBytes(token[1]);

      // Add the hex literal to the token list
      tokens.push({ type: TokenType.PUSH, name: toHex(95 + value.length / 2), args: [] });
    } else {
      token[0] = " ";
    }

    // Remove the most recent token from the body.
    body = body.slice(token[0].length);
  }

  return tokens;
};

export default parseMacros;
