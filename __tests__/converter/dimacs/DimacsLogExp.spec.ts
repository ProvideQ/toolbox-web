import each from "jest-each";
import { regexBlank } from "../../../src/converter/dimacs/Syntax/CommonSyntax";
import { DimacsParser } from "../../../src/converter/dimacs/DimacsParser";
import { regexComment } from "../../../src/converter/dimacs/Syntax/DimacsSyntax";
import { LogExpParser } from "../../../src/converter/dimacs/LogExpParser";
import { regexNOT } from "../../../src/converter/dimacs/Syntax/LogExpSyntax";

function isEquivalentLogExpr(f1: string, f2: string) {
    expect(f1.replace(regexNOT, '!')
            .replace(regexBlank, ''))
        .toBe(f2.replace(regexNOT, '!')
                .replace(regexBlank, ''));
}

function isEquivalentDimacs(f1: string, f2: string) {
    expect(f1.replace(regexComment, '')
        .replace(regexBlank, ''))
        .toBe(f2.replace(regexComment, '')
            .replace(regexBlank, ''));
}

describe("Parsing", () => {
    let dimacsParser = new DimacsParser();
    let logExprParser = new LogExpParser();

    each([
        [
            '((1 or 2 or not 3) and (!4 and (not 5 and 6)) and 3 and (7 or 2))',
            'c First comment\nc Some Comment\nc 1 => 1\np sat 7\n*(+( 1  2  -3 )*( -4 *( -5  6 )) 3 +( 7  2 ))'
        ],
        [
            '(1 or (2 and 3) or (((1 and 4) or 5) and 6))',
            'p sat 6\n+(1 *(2  3)*(+(*(1  4) 5) 6))'
        ],
        [
            '(((1 and not 2 and 3 and 4) or 3) and 5)',
            'c Sample DIMACS .sat file\np sat 5\n*(+(*(1  -2  3  4) 3) 5)'
        ],
        [
            '((1 and not 2) or 3)',
            'p sat 3\n+(*(1 -2) 3)'
        ],
        [
            '((1 and 2) or not 3)',
            'p sat 3\n+(*(1 2) -3)'
        ]
    ]).test("parsing bi-directional", (logExpr: string, dimacs: string) => {
        isEquivalentDimacs(logExprParser.parseDimacs(logExpr), dimacs);
        isEquivalentLogExpr(dimacsParser.parseLogicalExpression(dimacs), logExpr);
    });

    each([
        [
            '((a or b or not c) and (not x and (not y and z)) and c and (d or c))',
            'c 1 => a\n' +
            'c 2 => b\n' +
            'c 3 => c\n' +
            'c 4 => x\n' +
            'c 5 => y\n' +
            'c 6 => z\n' +
            'c 7 => d\n' +
            'p sat 7\n' +
            '*(+(1  2 -3) *(-4 *(-5  6)) 3 +(7  3))'
        ],
        [
            '(c or (a and b) or (((c and d) or e ) and f))',
            'c 1 => c\n' +
            'c 2 => a\n' +
            'c 3 => b\n' +
            'c 4 => d\n' +
            'c 5 => e\n' +
            'c 6 => f\n' +
            'p sat 6\n' +
            '+(1 *(2  3)*(+(*(1  4) 5) 6))'
        ],
        [
            '(((a and not d and c and b) or c) and e)',
            'c 1 => a\n' +
            'c 2 => d\n' +
            'c 3 => c\n' +
            'c 4 => b\n' +
            'c 5 => e\n' +
            'p sat 5\n' +
            '*(+(*(1  -2  3  4) 3) 5)'
        ],
        [
            '((a and not b) or c)',
            'c 1 => a\n' +
            'c 2 => b\n' +
            'c 3 => c\n' +
            'p sat 3\n' +
            '+(*(1  -2) 3)'
        ]
    ]).test("parsing dimacs with variable aliases", (logExpr: string, dimacs: string) => {
        isEquivalentLogExpr(dimacsParser.parseLogicalExpression(dimacs), logExpr);
    });
});