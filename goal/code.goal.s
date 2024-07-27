.global _start
_start:
    movl eax, 3
    movl ebx, 0
    movl eax, 1
    int 0x80
