import { Lexer, Token } from "@jlguenego/lexer";
import {
  blankRule,
  parenthesesRule,
  TokenName,
  variableRule,
} from "./Syntax/CommonSyntax";
import { andRule, negateRule, orRule } from "./Syntax/LogicalExpressionSyntax";

// the order is important - tokens are applied from first to last
const rules = [
  ...parenthesesRule,
  orRule,
  andRule,
  negateRule,
  variableRule,
  blankRule,
];

export class LogicalExpressionValidator {
  private lex: Lexer = new Lexer(rules);

  /**
   * Validates a logical expression
   * @param logicalExpression {string} logical expression
   * @returns {string[]} an array of errors, or null if there are none.
   */
  public validateLogicalExpression(logicalExpression: string): string[] | null {
    let tokens = this.lex.tokenize(logicalExpression);
    if (tokens.length == 0) return [];

    //Verify formula integrity
    return this.verifyTokens(tokens);
  }

  private verifyTokens(tokens: Token[]): string[] | null {
    let errors: string[] = [];
    let wasOperator = false;
    let wasVariable = false;
    let wasClose = false;
    let wasOpen = false;
    let wasNegate = false;

    if (tokens.length > 0) {
      switch (tokens[0].name) {
        case TokenName.or:
        case TokenName.and:
          errors.push("Formula can't start with operator (AND/OR)");
          break;
      }

      switch (tokens[tokens.length - 1].name) {
        case TokenName.or:
        case TokenName.and:
          errors.push("Formula can't end with operator (AND/OR)");
          break;
      }
    }

    for (let token of tokens) {
      switch (token.name) {
        case TokenName.or:
        case TokenName.and:
          if (wasOperator)
            errors.push("Two operators (AND/OR) can't be next to each other");
          if (wasOpen)
            errors.push(
              `Operator '${token.lexeme}' can't be after an opening parenthesis`
            );
          break;
        case TokenName.negate:
          if (wasClose)
            errors.push(
              `Negation '${token.lexeme}' is after a closing parenthesis`
            );
          if (wasVariable)
            errors.push(`Negation '${token.lexeme}' is after a variable`);
          break;
        case TokenName.variable:
          if (wasVariable)
            errors.push(
              `Variable '${token.lexeme}' is next to another variable`
            );
          if (wasClose)
            errors.push(
              `Variable '${token.lexeme}' is after a closing parenthesis`
            );
          break;
        case TokenName.open:
          if (wasVariable)
            errors.push("Parenthesis can't be opened after a variable");
          break;
        case TokenName.close:
          if (wasOperator)
            errors.push(
              "Parenthesis can't be closed after an operator (AND/OR)"
            );
          if (wasNegate)
            errors.push("Parenthesis can't be closed after a negation");
          break;
      }

      wasOperator = token.name == TokenName.and || token.name == TokenName.or;
      wasVariable = token.name == TokenName.variable;
      wasOpen = token.name == TokenName.open;
      wasClose = token.name == TokenName.close;
      wasNegate = token.name == TokenName.negate;
    }

    if (errors.length > 0) {
      return errors;
    } else {
      return null;
    }
  }
}
