import { Rule } from "@jlguenego/lexer";
import { TokenName } from "./CommonSyntax";

export const regexAND = /(?:&|and|AND)\b/;
export const regexOR = /(?:\||or|OR)\b/;
export const regexNOT = /not|NOT|!/g;

export const negateRule = new Rule({
  name: TokenName.negate,
  pattern: regexNOT,
});

export const andRule = new Rule({
  name: TokenName.and,
  pattern: regexAND,
});

export const orRule = new Rule({
  name: TokenName.or,
  pattern: regexOR,
});
