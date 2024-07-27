import { lex, Token, TokenType } from './lexer';

export class ASTNode { }

export class BinOp extends ASTNode {
    constructor(public left: ASTNode, public op: string, public right: ASTNode) {
        super();
    }
}

export class NumType extends ASTNode {
    constructor(public value: number) {
        super();
    }
}

export class StringType extends ASTNode {
    constructor(public value: string) {
        super();
    }
}

export function parse(tokens: Token[]): ASTNode {
    let currentTokenIndex = 0;

    function currentToken(): Token | null {
        return tokens[currentTokenIndex] || null;
    }

    function eat(tokenType: TokenType): Token {
        const token = currentToken();
        if (token && token.type === tokenType) {
            currentTokenIndex++;
            return token;
        }
        throw new Error(`Parser:eat -> Unexpected token: ${token ? token.value : 'EOF'}`);
    }

    function parseFactor(): ASTNode {
        const token = currentToken();
        if (token?.type === 'NUMBER') {
            eat('NUMBER');
            return new NumType(Number(token.value));
        }
        else if (token?.type === 'STRING') {
            eat('STRING');
            return new StringType(token.value.slice(1, -1).replace(/\\"/g, '"'));
        }
        else if (token?.type === 'LEFT_PAREN') {
            eat('LEFT_PAREN');
            const node = parseExpr();
            eat('RIGHT_PAREN');
            return node;
        }
        throw new Error(`Parser:parseFactor -> Unexpected token: ${token ? token.value : 'EOF'}`);
    }

    function parseTerm(): ASTNode {
        let node = parseFactor();
        while (currentToken()?.type === 'MULTIPLY' || currentToken()?.type === 'DIVIDE') {
            const token = eat(currentToken()?.type as TokenType);
            node = new BinOp(node, token.value, parseFactor());
        }
        return node;
    }

    function parseExpr(): ASTNode {
        let node = parseTerm();
        while (currentToken()?.type === 'PLUS' || currentToken()?.type === 'MINUS') {
            const token = eat(currentToken()?.type as TokenType);
            node = new BinOp(node, token.value, parseTerm());
        }

        return node;
    }

    return parseExpr();
}
