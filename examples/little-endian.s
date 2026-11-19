# Comprueba memoria little-endian, extensión de signo y espacio de 32 bits.
.global _start
_start:
    lui t0, 0x90001         # base 0x90001000
    li t1, 0x80ff7f01
    sw t1, 0(t0)
    lw t6, 0(t0)
    bne t1, t6, fail

    lb t2, 3(t0)           # 0xffffff80
    lbu t3, 3(t0)          # 0x00000080
    lh t4, 2(t0)           # 0xffff80ff
    lhu t5, 2(t0)          # 0x000080ff
    sb t3, 4(t0)
    sh t5, 6(t0)

    li t6, -128
    bne t2, t6, fail
    li t6, 128
    bne t3, t6, fail
    li t6, -32513
    bne t4, t6, fail
    li t6, 0x80ff
    bne t5, t6, fail

    li a0, 1
    li a7, 10
    ecall
fail:
    li a0, 0
    ebreak
