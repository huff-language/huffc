export declare type Definitions = {
    data: {
        [name: string]: {
            args: any[];
            value: string;
            data?: any;
        };
    };
    defintions: string[];
};
export declare type Operation = {
    type: OperationType;
    value: string;
    args: any[];
};
export declare enum OperationType {
    OPCODE = "OPCODE",
    PUSH = "PUSH",
    JUMPDEST = "JUMPDEST",
    PUSH_JUMP_LABEL = "PUSH_JUMP_LABEL",
    MACRO_CALL = "MACRO_CALL",
    CONSTANT_CALL = "CONSTANT_CALL",
    ARG_CALL = "ARG_CALL",
    CODESIZE = "CODESIZE",
    TABLE_START_POSITION = "TABLE_START_POSITION"
}
export declare enum Context {
    NONE = 0,
    MACRO = 1
}
//# sourceMappingURL=types.d.ts.map