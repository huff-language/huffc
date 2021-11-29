export enum TokenType {
  OPCODE = "OPCODE",
  PUSH = "PUSH",
  JUMPDEST = "JUMPDEST",
  PUSH_JUMP_LABEL = "PUSH_JUMP_LABEL",

  MACRO_CALL = "MACRO_CALL",
  CONSTANT_CALL = "CONSTANT_CALL",
  ARG_CALL = "ARG_CALL",

  CODESIZE = "CODESIZE",
  TABLE_START_POSITION = "TABLE_START_POSITION",
}

export type Definitions = {
  macros: { [name: string]: { args: string[]; body: string } };
  constants: { [name: string]: string };
  tables: { name: string; raw: string }[];
};

export type Token = { type: TokenType; name: string; args: string[]; ops?: Token[] };
