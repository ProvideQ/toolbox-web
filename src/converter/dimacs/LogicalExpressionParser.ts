import { Lexer, Token } from "@jlguenego/lexer";
import {
  blankRule,
  parenthesesRule,
  TokenName,
  variableRule,
} from "./Syntax/CommonSyntax";
import {
  andRule,
  negatedVariableRule,
  negateRule,
  orRule,
} from "./Syntax/LogicalExpressionSyntax";

// the order is important - tokens are applied from first to last
const rules = [
  ...parenthesesRule,
  orRule,
  andRule,
  negatedVariableRule,
  variableRule,
  blankRule,
];

export class LogicalExpressionParser {
  private lex: Lexer = new Lexer(rules);

  /**
   * Converts a logical expression to an expression in dimacs sat format
   * dimacs sat format: https://www.domagoj-babic.com/uploads/ResearchProjects/Spear/dimacs-cnf.pdf
   * @param logicalExpression {string} logical expression
   * @returns {string} formula in dimacs sat format of the input
   */
  public validateLogicalExpression(logicalExpression: string): string[] {
    let tokens = this.lex.tokenize(logicalExpression);
    if (tokens.length == 0) return [];

    //Verify formula integrity
    return this.verifyTokens(tokens);
  }

  private verifyTokens(tokens: Token[]): string[] {
    let errors: string[] = [];
    let wasOperator = false;
    let wasVariable = false;
    let wasClose = false;

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
          break;
        case TokenName.negatedVariable:
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
      }

      wasOperator = token.name == TokenName.and || token.name == TokenName.or;
      wasVariable =
        token.name == TokenName.variable ||
        token.name == TokenName.negatedVariable;
      wasClose = token.name == TokenName.close;
    }

    return errors;
  }
}
