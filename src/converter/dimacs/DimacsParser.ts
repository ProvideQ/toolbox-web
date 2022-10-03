import { Lexer, Token } from "@jlguenego/lexer";
import { andRule, commentRule, negateRule, orRule, problem, problemTypeKeywords, regexComment, sat, startKeywords } from "./Syntax/DimacsSyntax";
import { TokenName, parenthesesRule, variableRule, blankRule, regexBlank } from "./Syntax/CommonSyntax";

// the order is important - tokens are applied from first to last
const rules = [commentRule, ...startKeywords, ...problemTypeKeywords, ...parenthesesRule, andRule, orRule, negateRule, variableRule, blankRule];

//Inspired by https://github.com/Robbepop/dimacs-parser/blob/master/src/items.rs
export class DimacsParser {
    private lex: Lexer = new Lexer(rules);
    private tokenIterator!: IterableIterator<Token>;
    private output: string = '';
    private variables: Set<number> = new Set<number>();

    public parse(text: string): string {
        this.output = '';
        this.variables = new Set<number>();

        let tokens: Token[];
        try {
            tokens = this.lex.tokenize(text);
            this.tokenIterator = tokens[Symbol.iterator]()
        } catch (e: any) {
            throw new Error(
                "Couldn't tokenize the input string:\n"
                + e.message)
        }
        if (tokens.length == 0) return this.output;

        //Problem token
        let token = this.nextToken();
        if (token.name != problem) new Error("Must start with problem description");

        //Problem type token
        token = this.nextToken();
        switch (token.name) {
            case sat:
                this.parseSAT()
                break;
            default:
                new Error("Problem " + token.name + " is not supported");
        }

        //Replace with variable names from comments if possible
        let aliases = this.getVariableAliases(text);
        aliases.forEach((alias, num, _) => {
            //Workaround split, join to replace all
            this.output = this.output.split(num.toString()).join(alias);
        });

        return this.output;
    }

    private getVariableAliases(text: string): Map<number, string> {
        let aliases = new Map<number, string>();

        let match = text.match(regexComment);
        if (match == null) return aliases;

        for (let m of match) {
            let trimmed = m.replace(regexBlank, '');

            //Remove c at beginning
            trimmed = trimmed.substring(1);

            //Comments must be of type "Number variableAssignment AliasStr"
            let vars = trimmed.split(TokenName.variableAssignment);
            if (vars.length != 2) continue;
            if (!/\d/.test(vars[0])) continue;

            aliases.set(+vars[0], vars[1]);
        }

        return aliases;
    }

    private parseSAT() {
        //Determine variable count
        let token = this.nextToken()
        let expectedVariables = +token.lexeme;

        //Loop through body
        let current = this.tokenIterator.next();
        while (!current.done) {
            this.parseFormula(current.value as Token);
            current = this.tokenIterator.next();
        }

        //Check variable count
        let actualVariables = this.variables.size;
        if (expectedVariables != actualVariables) {
            throw new Error(`Expected ${expectedVariables} variables, but received ${actualVariables}`);
        }
    }

    private parseFormula(token: Token) {
        switch (token.name) {
            case TokenName.variable:
                this.variables.add(+token.lexeme);
                this.output += token.lexeme;
                break;
            case TokenName.negate:
                this.output += `${TokenName.negate} `;
                break;
            case TokenName.open:
                token = this.nextToken();
                while (token.name != TokenName.close) {
                    this.parseFormula(token);
                    token = this.nextToken();
                }
                break;
            case TokenName.and:
                this.parseFormulaParams(TokenName.and);
                break;
            case TokenName.or:
                this.parseFormulaParams(TokenName.or);
                break;
            default:
                throw new Error(`Unexpected token ${token.name} in formula at line ${token.position.line} column ${token.position.col}`);
        }
    }

    private parseFormulaParams(operator: string) {
        this.expectNextToken(TokenName.open);
        this.output += '(';

        let token = this.nextToken();
        let lastTokenType = '';

        // Parse all formulas inside the parentheses
        // Properly format them with log exp operators
        while (token.name != TokenName.close) {
            this.parseFormula(token);

            lastTokenType = token.name;
            token = this.nextToken();
            if (token.name != TokenName.close && lastTokenType != TokenName.negate) {
                this.output += ` ${operator} `;
            }
        }

        this.output += ')';
    }

    private nextToken(): Token {
        let current = this.tokenIterator.next();
        if (current.done) throw new Error('Tokens ended unexpectedly');

        return current.value as Token;
    }

    private expectNextToken(tokenType: string): Token {
        let token = this.nextToken();
        if (token.name != tokenType)
            throw new Error(`Expected ${tokenType} but received ${token.name} (${token.lexeme}) at line ${token.position.line} column ${token.position.col}`);

        return token;
    }
}