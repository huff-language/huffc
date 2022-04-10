"use strict";
exports.__esModule = true;
exports.Context = exports.OperationType = void 0;
/* Operation Type */
var OperationType;
(function (OperationType) {
    OperationType["OPCODE"] = "OPCODE";
    OperationType["PUSH"] = "PUSH";
    OperationType["JUMPDEST"] = "JUMPDEST";
    OperationType["PUSH_JUMP_LABEL"] = "PUSH_JUMP_LABEL";
    OperationType["MACRO_CALL"] = "MACRO_CALL";
    OperationType["CONSTANT_CALL"] = "CONSTANT_CALL";
    OperationType["ARG_CALL"] = "ARG_CALL";
    OperationType["CODESIZE"] = "CODESIZE";
    OperationType["TABLE_START_POSITION"] = "TABLE_START_POSITION";
})(OperationType = exports.OperationType || (exports.OperationType = {}));
/* Top Level Context */
var Context;
(function (Context) {
    Context[Context["NONE"] = 0] = "NONE";
    Context[Context["MACRO"] = 1] = "MACRO";
})(Context = exports.Context || (exports.Context = {}));
