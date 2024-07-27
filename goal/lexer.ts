export type TokenType =
    'STRING'
    | 'NUMBER'
    | 'IDENT'
    | 'ASSIGN'
    | 'END'
    | 'PLUS'
    | 'MINUS'
    | 'MULTIPLY'
    | 'DIVIDE'
    | 'LEFT_PAREN'
    | 'RIGHT_PAREN'
    | 'SKIP'
    | 'NEWLINE'
    | 'MISMATCH';


export class Token {
    constructor(public type: TokenType, public value: string) { }
}

export function lex(sourceCode: string): Token[] {
    const tokenSpec: [TokenType, RegExp][] = [
        ['NUMBER', /\d+/],
        ['IDENT', /[A-Za-z_]\w*/],
        ['ASSIGN', /=/],
        ['END', /;/],
        ['PLUS', /\+/],
        ['MINUS', /-/],
        ['MULTIPLY', /\*/],
        ['DIVIDE', /\//],
        ['LEFT_PAREN', /\(/],
        ['RIGHT_PAREN', /\)/],
        ['STRING', /"(?:[^"\\]|\\.)*"/],
        ['SKIP', /[ \t]+/],
        ['NEWLINE', /\n/],
        ['MISMATCH', /./],
    ];

    const tokens: Token[] = [];
    let lineNum = 1;
    let match: RegExpExecArray | null;

    while (sourceCode.length > 0) {
        for (let [type, regex] of tokenSpec) {
            if (match = regex.exec(sourceCode)) {
                if (type === 'NEWLINE') {
                    lineNum++;
                } else if (type !== 'SKIP') {
                    if (type === 'MISMATCH') {
                        throw new Error(`Lexer -> Unexpected token: ${match[0]} on line ${lineNum}`);
                    }
                    tokens.push(new Token(type, match[0]));
                }

                sourceCode = sourceCode.slice(match[0].length);

                break;
            }
        }
    }

    return tokens;
}
