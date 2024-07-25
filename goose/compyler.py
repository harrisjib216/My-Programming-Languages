from parser import *

import llvmlite.binding as llvm
import llvmlite.ir as ir

llvm.initialize()
llvm.initialize_native_target()
llvm.initialize_native_asmprinter()

class LLVMCodeGen:
    def __init__(self):
        self.module = ir.Module(name="module")
        self.builder = None
        self.func = None

    def generate_code(self, node):
        if isinstance(node, Assign):
            var = ir.GlobalVariable(self.module, ir.IntType(32), node.name)
            var.initializer = self.generate_code(node.value)
            return var
        elif isinstance(node, BinOp):
            left = self.generate_code(node.left)
            right = self.generate_code(node.right)
            if node.op == '+':
                return self.builder.add(left, right)
            elif node.op == '-':
                return self.builder.sub(left, right)
            elif node.op == '*':
                return self.builder.mul(left, right)
            elif node.op == '/':
                return self.builder.sdiv(left, right)
        elif isinstance(node, Num):
            return ir.Constant(ir.IntType(32), node.value)
        elif isinstance(node, Var):
            return self.module.get_global(node.name)

    def create_main(self, ast):
        func_type = ir.FunctionType(ir.VoidType(), [])
        self.func = ir.Function(self.module, func_type, name="main")
        block = self.func.append_basic_block(name="entry")
        self.builder = ir.IRBuilder(block)
        self.generate_code(ast)
        self.builder.ret_void()
