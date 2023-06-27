import { Lexer, Token } from "@jlguenego/lexer";
import {
  TokenName,
  parenthesesRule,
  variableRule,
  blankRule,
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
const rulesNegation = [negateRule, variableRule, blankRule];

interface LeveledToken {
  level: number;
  token: Token;
}

export class LogicalExpressionParser {
  private lex: Lexer = new Lexer(rules);
  private lexNegation: Lexer = new Lexer(rulesNegation);
  private output: string = "";

  /**
   * Converts a logical expression to an expression in dimacs sat format
   * dimacs sat format: https://www.domagoj-babic.com/uploads/ResearchProjects/Spear/dimacs-cnf.pdf
   * @param logicalExpression {string} logical expression
   * @returns {string} formula in dimacs sat format of the input
   */
  public parseDimacs(logicalExpression: string): string {
    this.output = "";

    let tokens = this.lex.tokenize(logicalExpression);
    if (tokens.length == 0) return this.output;

    //Verify formula integrity
    let errors = this.verifyTokens(tokens);
    if (errors.length > 0) {
      let errorStr = "";
      for (let error of errors) errorStr += error + "\n";

      throw new Error(errorStr);
    }

    //Handle variable comments and program start
    let variables = this.convertVariables(tokens);
    variables.forEach((num, str, _) => {
      this.output += `c ${num} ${TokenName.variableAssignment} ${str}\n`;
    });
    this.output += `p sat ${variables.size}\n`;

    this.parseFormula(tokens);

    return this.output;
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
  /**
   * Converts any negative variable's negative prefix
   * Converts all variables to numbers
   * @param tokens {Token[]} array of tokens to search for variables
   * @returns {Map<string, number>} variables mapped to their number representation
   */
  private convertVariables(tokens: Token[]): Map<string, number> {
    let variables = new Map<string, number>();
    const addToMap = (str: string): number => {
      let number = variables.get(str);
      if (number == undefined) {
        number = variables.size + 1;
        variables.set(str, number);
      }

      return number;
    };

    for (let i = 0; i < tokens.length; i++) {
      switch (tokens[i].name) {
        case TokenName.variable:
          tokens[i].lexeme = addToMap(tokens[i].lexeme).toString();
          break;
        case TokenName.negatedVariable:
          let negTokens = this.lexNegation.tokenize(tokens[i].lexeme);
          if (negTokens.length != 2)
            throw new Error(
              "Can't parse negated variables that don't have two tokens"
            );

          let negToken = negTokens[1] as Token;
          let varNumber = addToMap(negToken.lexeme);

          //Replace negated variable with dimacs negative variable syntax
          negToken.lexeme = `-${varNumber}`;
          tokens[i] = negToken;
          break;
      }
    }

    return variables;
  }

  private getLeveledTokens(tokens: Token[]): LeveledToken[] {
    let leveledTokens: LeveledToken[] = [];
    let curLevel = 0;

    for (let token of tokens) {
      switch (token.name) {
        case TokenName.open:
          curLevel++;
          break;
        case TokenName.close:
          curLevel--;
          break;
        default:
          leveledTokens.push({ token: token, level: curLevel });
          break;
      }
    }

    return leveledTokens;
  }

  private parseFormula(tokens: Token[]) {
    let leveledTokens = this.getLeveledTokens(tokens);

    //Start recursive parsing of formula starting with or
    this.processOR(leveledTokens);
  }

  private getOperatorPositions(
    tokens: LeveledToken[],
    operator: string,
    level: number
  ): number[] {
    let positions: number[] = [];
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      switch (token.token.name) {
        case operator:
          if (token.level == level) positions.push(i);
          break;
        default:
          break;
      }
    }

    //Always add token length
    positions.push(tokens.length);

    return positions;
  }

  private getMinLevel(tokens: LeveledToken[]): number {
    let minLevel = undefined;

    for (const token of tokens) {
      if (minLevel == undefined || token.level < minLevel) {
        minLevel = token.level;
      }
    }

    return minLevel ?? -1;
  }

  private processAND(tokens: LeveledToken[]): LeveledToken[] {
    if (tokens.length < 2) {
      this.output += ` ${tokens[0].token.lexeme} `;
      return tokens;
    }

    let level = this.getMinLevel(tokens);
    let operatorPositions = this.getOperatorPositions(
      tokens,
      TokenName.and,
      level
    );
    if (operatorPositions.length == 1) return this.processOR(tokens);

    let returnTokens: LeveledToken[] = [];
    let lastOr = -1;

    this.output += `*(`;
    for (let pos of operatorPositions) {
      let before = tokens.slice(lastOr + 1, pos);
      lastOr = pos;

      let processedBefore = this.processOR(before);
      returnTokens.push(...processedBefore);
    }
    this.output += `)`;

    return returnTokens;
  }

  private processOR(tokens: LeveledToken[]): LeveledToken[] {
    if (tokens.length < 2) {
      this.output += ` ${tokens[0].token.lexeme} `;
      return tokens;
    }

    let level = this.getMinLevel(tokens);
    let operatorPositions = this.getOperatorPositions(
      tokens,
      TokenName.or,
      level
    );
    if (operatorPositions.length == 1) return this.processAND(tokens);

    let returnTokens: LeveledToken[] = [];
    let lastOr = -1;

    if (operatorPositions.length > 1) this.output += `+(`;
    for (let pos of operatorPositions) {
      let before = tokens.slice(lastOr + 1, pos);
      lastOr = pos;

      //Start processing nested expressions with OR
      let processedBefore =
        before[0].level != level
          ? this.processOR(before)
          : this.processAND(before);
      returnTokens.push(...processedBefore);
    }
    if (operatorPositions.length > 1) this.output += `)`;

    return returnTokens;
  }
}
