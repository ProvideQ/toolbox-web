import { Rule } from "@jlguenego/lexer";
import { TokenName } from "./CommonSyntax";

export const problem = "p";
export const sat = "sat";

const regexNegate = /-/;
const regexAND = /\*/;
const regexOR = /\+/;
export const regexComment = /c[^\n]*\n/g;

export const startKeywords = Rule.createKeywords([problem]);
export const problemTypeKeywords = Rule.createKeywords([sat]);

export const negateRule = new Rule({
  name: TokenName.negate,
  pattern: regexNegate,
});

export const andRule = new Rule({
  name: TokenName.and,
  pattern: regexAND,
});

export const orRule = new Rule({
  name: TokenName.or,
  pattern: regexOR,
});

export const commentRule = new Rule({
  name: "comment",
  pattern: regexComment,
  ignore: true,
});
