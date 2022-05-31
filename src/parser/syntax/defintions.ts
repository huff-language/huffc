/* Regex Imports */
import { combineRegexElements } from "../utils/regex";

/* High Level Syntax */
export const HIGH_LEVEL = {
  IMPORT: combineRegexElements([
    /* "#" At the start of a line */
    "^(?:[\\s\\n]*)#",

    /* The word "include" */
    "(?:include)",

    /* Quotation marks */
    "(?:\\\"|\\')",

    /* All alphanumeric characters, representing the filename */
    "(.*)",

    /* Quotation marks */
    "(?:\\\"|\\')",
  ]),

  /* Syntax for macros */
  MACRO: combineRegexElements([
    /* "#define" at the start of the line */
    "^(?:[\\s\\n]*#[\\s\\n]*define)",

    /* The whole word "macro" */
    "\\b(macro)\\b",

    /* The name of the macro, which can be anything */
    "([A-Za-z0-9_]\\w*)",

    /* Parenthesis that can contain anything (macro arguments) */
    "\\(((.*))\\)",

    /* Equals sign */
    "=",

    /* The word "takes" */
    "takes",

    /**
     * A sequence of digits (a number) surrounded by parenthesis
     * This number represents the number of "arguments" that the macro takes
     */
    "\\((\\d+)\\)",

    /* The word "returns" */
    "returns",

    /* A sequence of digits (a number) surrounded by parenthesis */
    "\\((\\d+)\\)",

    /**
     * Curly brackets that can contain all characters.
     * In this case, these are the contents of the macro.
     */
    "\\{((?:[^\\}])*)\\}",
  ]),

  FUNCTION: combineRegexElements([
    /* #define event at the start of the line */
    "^(?:[\\s\\n]*[\\s\\n]*#define function)",

    /**
     * The function name and parameter types
     * which is then turned into the function signature.
     * For example "example(uint, bool)"
     */
    "((?:[\\s\\n]*)([a-zA-Z0-9_]+)(?:\\(([a-zA-Z0-9_\\[\\],\\s\\n]+)?\\)))",

    /**
     * The function type (payable, nonpayable, view, pure).
     */
    "(payable|nonpayable|view|pure)",

    /**
     * The word "returns"
     */
    "(?:[\\s\\n]* returns)",

    /**
     * The return type of the function within parenthesis.
     */
    "(?:\\(([a-zA-Z0-9_\\[\\],\\s\\n]+)?\\))",
  ]),

  EVENT: combineRegexElements([
    /* #define event at the start of the line */
    "^(?:[\\s\\n]*[\\s\\n]*#define event)",

    /**
     * The event name and parameter types
     * which is then turned into the function signature.
     * For example "example(uint, bool)"
     */
    "((?:[\\s\\n]*)([a-zA-Z0-9_]+)(?:\\(([a-zA-Z0-9_,\\s\\n]+)?\\)))",
  ]),

  /* Syntax for constants */
  CONSTANT: combineRegexElements([
    /* "#define" at the start of the line */
    "^(?:[\\s\\n]*#define)",

    /* The whole word "constant" */
    "\\b(constant)\\b",

    /* The name of the constant, which can be everything */
    "([A-Za-z0-9_]\\w*)",

    /* Equals sign */
    "=",

    /* Hex literal */
    "(((?:[\\s\\n]*)0x([0-9a-fA-F]+)\\b)|(FREE_STORAGE_POINTER\\(\\)))",
  ]),

  /* Syntax for code tables */
  CODE_TABLE: combineRegexElements([
    /* "#define" at the start of the line */
    "^(?:[\\s\\n]*#[\\s\\n]*define)",

    /* The whole word "table" */
    "\\b(table)\\b",

    /* The name of the table, which can be anything */
    "([A-Za-z0-9_]\\w*)",

    /**
     * Curly brackets that can contain all characters.
     * In this case, these are the contents of the table.
     */
    "\\{((?:[^\\}])*)\\}",
  ]),

  /* Syntax for jump tables */
  JUMP_TABLE: combineRegexElements([
    /* "#define" at the start of the line */
    "^(?:[\\s\\n]*#[\\s\\n]*define)",

    /* The whole word "jumptable" */
    "\\b(jumptable)\\b",

    /* The name of the table, which can be anything */
    "([A-Za-z0-9_]\\w*)",

    /**
     * Curly brackets that can contain all characters.
     * In this case, these are the contents of the jumptable.
     */
    "\\{((?:[^\\}])*)\\}",
  ]),

  /* Syntax for packed jump tables */
  JUMP_TABLE_PACKED: combineRegexElements([
    /* "#define" at the start of the line */
    "^(?:[\\s\\n]*#[\\s\\n]*define)",

    /* The whole word "jumptable__packed" */
    "\\b(jumptable__packed)\\b",

    /* The name of the table, which can be anything */
    "([A-Za-z0-9_]\\w*)",

    /**
     * Curly brackets that can contain all characters.
     * In this case, these are the contents of the jumptable.
     */
    "\\{((?:[^\\}])*)\\}",
  ]),
};

/* Jump Table Syntax */
export const JUMP_TABLES = {
  /* All characters, with any number of whitespace before and after */
  JUMPS: new RegExp("(?:[\\s\\n]*)[a-zA-Z_0-9\\-]+(?:$|\\s+)", "g"),
};

/* Code Syntax, found within macros */
export const MACRO_CODE = {
  /* Any text before spaces and newlines */
  TOKEN: combineRegexElements(["\\s*\\n*([^\\s]*)\\s*\\n*"]),

  /* Any alphanumeric combination followed by 0x */
  LITERAL_HEX: combineRegexElements(["^(?:[\\s\\n]*)0x([0-9a-fA-F]+)\\b"]),

  /* Syntax for macro calls */
  MACRO_CALL: combineRegexElements([
    /* Any number of alphanumeric characters + underscores */
    "^(?:[\\s\\n]*)([a-zA-Z0-9_]+)",

    /* Open Parenthesis */
    "\\(",

    /* Any alphanumeric combination */
    "([a-zA-Z0-9_, \\-<>]*)",

    /* Closing parenthesis */
    "\\)\\s*\\n*",
  ]),

  /* Syntax for constant calls */
  CONSTANT_CALL: combineRegexElements([
    /* Any number of alphanumeric characters + underscores */
    "^(?:[\\s\\n]*)\\[([A-Z0-9_]+)\\]",
  ]),

  /* Syntax for the builtin codesize function */
  CODE_SIZE: combineRegexElements([
    /* The string "__codesize" */
    "^(?:[\\s\\n]*)__codesize",

    /* Open Parenthesis */
    "\\(",

    /* Any alphanumeric combination */
    "([a-zA-Z0-9_\\-]+)",

    /* Template Arguments */
    "(?:<([a-zA-Z0-9_,\\s\\n]+)>)?",

    /* Closing parenthesis */
    "\\)\\s*\\n*",
  ]),

  /* Syntax for the builtin table size function */
  TABLE_SIZE: combineRegexElements([
    /* The string "__tablesize" */
    "^(?:[\\s\\n]*)__tablesize",

    /* Open Parenthesis */
    "\\(",

    /* Any alphanumeric combination */
    "([a-zA-Z0-9_\\-]+)",

    /* Template Arguments */
    "(?:<([a-zA-Z0-9_,\\s\\n]+)>)?",

    /* Closing parenthesis */
    "\\)\\s*\\n*",
  ]),

  /* Syntax for the builtin table start function */
  TABLE_START: combineRegexElements([
    /* The string "__tablestart" */
    "^(?:[\\s\\n]*)__tablestart",

    /* Open Parenthesis */
    "\\(",

    /* Any alphanumeric combination */
    "([a-zA-Z0-9_\\-]+)",

    /* Template Arguments */
    "(?:<([a-zA-Z0-9_,\\s\\n]+)>)?",

    /* Closing parenthesis */
    "\\)\\s*\\n*",
  ]),

  /* Syntax for template calls */
  ARG_CALL: combineRegexElements(["^(?:[\\s\\n]*)", "<([a-zA-Z0-9_\\-\\+\\*]+)>", "\\s*\\n*"]),

  /* Syntax for jumptables */
  JUMP_LABEL: combineRegexElements(["^(?:[\\s\\n]*)([a-zA-Z0-9_\\-]+):\\s*\\n*"]),
};
