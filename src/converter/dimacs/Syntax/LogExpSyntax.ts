import { Rule } from "@jlguenego/lexer";
import { and, negate, negatedVariable, or, variableRegexPart } from "./CommonSyntax";

export const negateRegexPart = '(?:(?:not|NOT)\\s+|(?:!\\s*))';

export const regexAND = /(?:&|and|AND) /;
export const regexOR = /(?:\||or|OR) /;
export const regexNOT = new RegExp(negateRegexPart, 'g');
export const regexNOTVariable = new RegExp(`${negateRegexPart}\\s*${variableRegexPart}`);

export const negateRule = new Rule({
    name: negate,
    pattern: regexNOT,
});

export const negatedVariableRule = new Rule({
    name: negatedVariable,
    pattern: regexNOTVariable,
});

export const andRule = new Rule({
    name: and,
    pattern: regexAND,
})

export const orRule = new Rule({
    name: or,
    pattern: regexOR,
})