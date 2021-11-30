import { Token, TokenType, Definitions } from "../../parser/utils/enums";
import { MACRO_CODE } from "../../utils/langauge/syntax";

import { toHex, formatEvenBytes } from "../../utils/helpers/data/bytes";

/**
 * Compile a token
 * @param macro The macro to compile
 * @param definitions Definitions map
 * @param tokens Tokens to compile
 */
const compileMacro = (macro: string, definitions: Definitions, tokens: Token[], args: string[]) => {
  // Generate a map of parameters to their values
  const argsMap = getArgsMap(definitions.macros[macro].args, args);

  // Iterate over tokens
  const codes = tokens.map((token) => {
    switch (token.type) {
      case TokenType.MACRO_CALL: {
        // Compile the macro
        return compileMacro(token.name, definitions, token.ops, token.args);
      }
      case TokenType.CONSTANT_CALL: {
        return { bytecode: definitions.constants[token.name].slice(2) };
      }
      case TokenType.ARG_CALL: {
        return { bytecode: parseArgCall(token.name, argsMap) };
      }
    }
  });

  return codes;
};

const parseArgCall = (arg: string, map: { [name: string]: string }): string => {
  const value = map[arg];
  if (value.match(MACRO_CODE.ARG_CALL)) {
    const bytesValue = formatEvenBytes(value);
    return toHex(95 + bytesValue.length / 2) + bytesValue;
  }
};

// TODO: Add error here
const getArgsMap = (params: string[], args: string[]): { [name: string]: string } => {
  const map: { [name: string]: string } = {};
  params.map((param, index) => {
    map[param] = args[index];
  });

  return map;
};
