class ASTNode:
    pass

class BinOp(ASTNode):
    def __init__(self, left, op, right):
        self.left = left
        self.op = op
        self.right = right

class Num(ASTNode):
    def __init__(self, value):
        self.value = value

class String(ASTNode):
    def __init__(self, value):
        self.value = value

class Var(ASTNode):
    def __init__(self, name):
        self.name = name

class Assign(ASTNode):
    def __init__(self, name, value):
        self.name = name
        self.value = value

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def consume(self):
        self.pos += 1

    def current_token(self):
        return self.tokens[self.pos]

    def parse(self):
        print("Parsing")
        return self.assignment()

    def assignment(self):
        if self.current_token()[0] == 'ID':
            name = self.current_token()[1]
            self.consume()
            if self.current_token()[0] == 'ASSIGN':
                self.consume()
                value = self.expr()
                return Assign(name, value)
        return self.expr()

    def expr(self):
        node = self.term()
        while self.current_token()[0] in ('PLUS', 'MINUS'):
            op = self.current_token()[1]
            self.consume()
            node = BinOp(node, op, self.term())
        return node

    def term(self):
        node = self.factor()
        while self.current_token()[0] in ('MUL', 'DIV'):
            op = self.current_token()[1]
            self.consume()
            node = BinOp(node, op, self.factor())
        return node

    def factor(self):
        token = self.current_token()
        if token[0] == 'NUMBER':
            self.consume()
            return Num(token[1])
        elif token[0] == 'STRING':
            self.consume()
            return String(token[1])
        elif token[0] == 'ID':
            self.consume()
            return Var(token[1])
        elif token[0] == 'LPAREN':
            self.consume()
            node = self.expr()
            if self.current_token()[0] == 'RPAREN':
                self.consume()
                return node
        raise RuntimeError(f'Unexpected token: {token}')
