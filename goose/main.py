from reader import fetch_code
from lexer import tokenize
from parser import Parser
from compyler import LLVMCodeGen
from finisher import make_temp_output, convert_ir_to_asm, convert_asm_to_exe

# fetch source code
# tokenize it
# build ast
ast = Parser(tokenize(fetch_code())).parse()

# make ast for LLVM
codegen = LLVMCodeGen()
codegen.create_main(ast)

# clear ast for better efficiency
ast = None

# save LLVM Intermediate Representation
make_temp_output(codegen.module)

# clear codegen
codegen = None

# convert LLVM IR to real assembly
convert_ir_to_asm()
convert_asm_to_exe()