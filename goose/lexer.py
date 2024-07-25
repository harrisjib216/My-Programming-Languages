import re

TOKEN_SPEC = [
    ('NUMBER',   r'\d+'),
    ('ID',       r'[A-Za-z_]\w*'),
    ('ASSIGN',   r'='),
    ('PLUS',     r'\+'),
    ('MINUS',    r'-'),
    ('MUL',      r'\*'),
    ('DIV',      r'/'),
    ('LPAREN',   r'\('),
    ('RPAREN',   r'\)'),
    ('SEMI',     r';'),
    ('SKIP',     r'[ \t]+'),
    ('NEWLINE',  r'\n'),
    ('STRING',   r'""|"(.*?)"'),
    ('MISMATCH', r'.'),
]

def gen_tokens(code):
    token_regex = '|'.join('(?P<%s>%s)' % pair for pair in TOKEN_SPEC)
    for mo in re.finditer(token_regex, code):
        kind = mo.lastgroup
        value = mo.group()
        if kind == 'NUMBER':
            value = int(value)
        elif kind == 'STRING':
            value = str(value[1:len(value) - 1])
        elif kind == 'SKIP' or kind == 'NEWLINE':
            continue
        elif kind == 'MISMATCH':
            raise RuntimeError(f'Unexpected character: {value}')
        yield kind, value

def tokenize(code):
    print("Tokenizing")
    return list(gen_tokens(code))