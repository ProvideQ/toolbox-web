import { Group, Rule } from "@jlguenego/lexer";

export const and = 'and';
export const or = 'or';
export const negate = 'not';
export const open = 'open';
export const close = 'close';
export const variable = 'variable';
export const negatedVariable = 'negatedVariable';

export const variableAssignment = '=>';

export const variableRegexPart = '(?:[A-z]|\\d)+';
export const regexVariable = new RegExp(variableRegexPart);
export const regexBlank = /\s+/g;

export const variableRule = new Rule({
    name: variable,
    pattern: regexVariable,
});

export const parenthesesRule = Rule.createGroup(Group.SEPARATORS, [
    {
        name: open,
        pattern: /\(/,
    },
    {
        name: close,
        pattern: /\)/,
    },
]);

export const blankRule = new Rule({
    name: 'blank',
    pattern: regexBlank,
    ignore: true,
});