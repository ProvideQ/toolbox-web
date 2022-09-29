import { regexVariable } from "../../../converter/dimacs/Syntax/CommonSyntax";
import { regexAND, regexNOTVariable, regexOR } from "../../../converter/dimacs/Syntax/LogExpSyntax";

export const SAT_language = {
    'and': {
        pattern: regexAND,
        alias: 'boolean'
    },
    'or': {
        pattern: regexOR,
        alias: 'boolean'
    },
    'SAT-punctuation': /[()]/,
    'negation': {
        pattern: regexNOTVariable,
        alias: 'string'
    },
    'SAT-variable': {
        pattern: regexVariable,
        lookbehind: true,
        greedy: true,
        alias: 'important'
    }
};