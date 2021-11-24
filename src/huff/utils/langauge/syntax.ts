/* Regex Imports */
import { combineRegexElements } from "../helpers/regex";

/* High Level Syntax */
export const highLevelSyntax = {
  /* Syntax for templates */
  TEMPLATE: combineRegexElements([
    /* Requires "template" at the start of the line */
    "^(?:[\\s\\n]*)template",

    /* Pair of brackets (<>) that can contain anything */
    "\\<(.*)\\>",
  ]),

  /* Syntax for macros */
  MACRO: combineRegexElements([
    /* "#define" at the start of the line */
    "^(?:[\\s\\n]*#[\\s\\n]*define)",

    /* The whole word "macro" */
    "\\b(macro)\\b",

    /* The name of the macro, which can be anything */
    "([A-Za-z0-9_]\\w*)",

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
