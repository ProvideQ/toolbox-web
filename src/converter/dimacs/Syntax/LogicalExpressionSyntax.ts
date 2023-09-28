import { Rule } from "@jlguenego/lexer";
import { TokenName, variableRegexPart } from "./CommonSyntax";

export const negateRegexPart = "(?:(?:not|NOT)\\s+|(?:!\\s*))";

export const regexAND = /(?:&|and|AND) /;
export const regexOR = /(?:\||or|OR) /;
export const regexNOT = new RegExp(negateRegexPart, "g");
export const regexNOTVariable = new RegExp(
  `${negateRegexPart}\\s*${variableRegexPart}`
);

export const negateRule = new Rule({
  name: TokenName.negate,
  pattern: regexNOT,
});

export const negatedVariableRule = new Rule({
  name: TokenName.negatedVariable,
  pattern: regexNOTVariable,
});

export const andRule = new Rule({
  name: TokenName.and,
  pattern: regexAND,
});

export const orRule = new Rule({
  name: TokenName.or,
  pattern: regexOR,
});
