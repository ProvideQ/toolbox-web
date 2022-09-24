export const SAT_language = {
    'SAT-operator': {
        pattern: /\b(?:and|or|AND|OR)\b/,
        alias: 'boolean'
    },
    'punctuation': /[{}[\];(),.:]/,
    'SAT-variable': {
        pattern: /(?:\\.|[^"\\\r\n])/,
        lookbehind: true,
        greedy: true,
        alias: 'important'
    }
};