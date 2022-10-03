import { Group, Rule } from "@jlguenego/lexer";

export enum TokenName {
    and = 'and',
    or = 'or',
    negate = 'not',
    open = 'open',
    close = 'close',
    variable = 'variable',
    negatedVariable = 'negatedVariable',
    variableAssignment = '=>'
}

export const variableRegexPart = '(?:[A-z]|\\d)+';
export const regexVariable = new RegExp(variableRegexPart);
export const regexBlank = /\s+/g;

export const variableRule = new Rule({
    name: TokenName.variable,
    pattern: regexVariable,
});

export const parenthesesRule = Rule.createGroup(Group.SEPARATORS, [
    {
        name: TokenName.open,
        pattern: /\(/,
    },
    {
        name: TokenName.close,
        pattern: /\)/,
    },
]);

export const blankRule = new Rule({
    name: 'blank',
    pattern: regexBlank,
    ignore: true,
});