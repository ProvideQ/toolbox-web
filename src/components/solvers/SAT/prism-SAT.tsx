export const SAT_language = {
    'SAT-negation': {
        pattern: /(?:!|\*)(?:[A-z]|\d)*\b/,
        alias: 'important'
    },
    'SAT-operator-letters': {
        pattern: /\b(?:&|\||and|or|AND|OR)\b/,
        alias: 'boolean'
    },
    'SAT-operator-non-letters': {
        pattern: /(?:\&|\||\+|\*)/,
        alias: 'boolean'
    },
    'punctuation': /[()]/,
    'SAT-variable': {
        pattern: /(?:[A-z]|\d)/,
        lookbehind: true,
        greedy: true,
        alias: 'string'
    }
};