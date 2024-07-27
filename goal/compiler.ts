import { ASTNode, BinOp, NumType, StringType } from './parser';

import { execSync } from 'child_process';


function generateCode(node: ASTNode): string {
    if (node instanceof NumType) {
        return `    movl eax, ${node.value}\n`;
    } else if (node instanceof StringType) {
        const label = `str${Math.random().toString(36).substring(2, 15)}`; // Unique label
        return (
            `    mov rdi, ${label}\n` +
            `    mov rax, 1\n` +
            `    mov rdi, 1\n` +
            `    mov rsi, ${label}\n` +
            `    mov rdx, ${node.value.length}\n` +
            `    syscall\n` +
            `    ; String label\n` +
            `${label}:\n` +
            `    db '${node.value.replace(/'/g, "''")}'\n` // Escape single quotes
        );
    }
    else if (node instanceof BinOp) {
        const leftCode = generateCode(node.left);
        const rightCode = generateCode(node.right);
        let operatorCode: string;

        switch (node.op) {
            case '+':
                operatorCode = '    add eax, ebx\n';
                break;
            case '-':
                operatorCode = '    sub eax, ebx\n';
                break;
            case '*':
                operatorCode = '    imul eax, ebx\n';
                break;
            case '/':
                operatorCode = '    xor edx, edx\n    idiv ebx\n';
                break;
            default:
                throw new Error('Unknown operator');
        }

        return (
            leftCode +
            '    push eax\n' +
            rightCode +
            '    pop ebx\n' +
            operatorCode
        );
    }

    throw new Error('Unknown AST node type');
}

export async function compile(programName: string, ast: ASTNode) {
    console.log('Converting to assembly');
    let code = '.global _start\n_start:\n';
    code += generateCode(ast);
    code += '    movl ebx, 0\n    movl eax, 1\n    int 0x80\n';

    console.log('Saving assembly to a temp file');
    await Bun.write(`${programName}.s`, code);

    console.log('Compiling assembly to an executable');
    execSync(`as -o ${programName}.o ${programName}.s`);

    console.log('Linking executable');
    execSync(`ld -o ${programName} ${programName}.o`);
}
