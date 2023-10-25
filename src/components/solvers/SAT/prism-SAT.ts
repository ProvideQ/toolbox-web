import { regexVariable } from "../../../converter/dimacs/Syntax/CommonSyntax";
import {
  regexAND,
  regexNOT,
  regexOR,
} from "../../../converter/dimacs/Syntax/LogicalExpressionSyntax";

export const SAT_language = {
  and: {
    pattern: regexAND,
    alias: "boolean",
  },
  or: {
    pattern: regexOR,
    alias: "boolean",
  },
  "SAT-punctuation": /[()]/,
  negation: {
    pattern: regexNOT,
    alias: "string",
  },
  "SAT-variable": {
    pattern: regexVariable,
    lookbehind: true,
    greedy: true,
    alias: "important",
  },
};
