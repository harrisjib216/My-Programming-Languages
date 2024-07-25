import os

def make_temp_output(codegen_module):
    print("Saving LLVM IR to a temp file")
    with open("output.ll", "w") as f:
        f.write(str(codegen_module))

def convert_ir_to_asm():
    print("Converting LLVM IR to Assembly")
    os.system("llc -filetype=obj output.ll -o output.o")

def convert_asm_to_exe():
    print("Converting Assembly an Exe")
    os.system("clang output.o -o output.exe")
