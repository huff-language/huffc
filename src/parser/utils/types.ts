/* Type Representing Defintions */
export type Definitions = {
  data: { [name: string]: { args: any[]; value: string; data?: any } };
  defintions: string[];
};

/* Type Representing an Operation */
export type Operation = {
  type: OperationType;
  value: string;
  args: any[];
};

/* Operation Type */
export enum OperationType {
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

/* Top Level Context */
export enum Context {
  NONE = 0,
  MACRO = 1,
}
