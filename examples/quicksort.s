# Adaptado del ejemplo de la consigna (Pastebin MmQzpFyR).
.global _start
_start:
	li		sp, 0x10000
    li		a0, 0x1000

    li		t1, 6
    sw 		t1, 0(a0)
    li 		t1, 4
    sw 		t1, 4(a0)
    li 		t1, 3
    sw 		t1, 8(a0)
    li 		t1, 2
    sw 		t1, 12(a0)
    li 		t1, 1
    sw 		t1, 16(a0)
    li 		t1, 8
    sw 		t1, 20(a0)
    li 		t1, 9
    sw 		t1, 24(a0)

    li		a1, 0
    li 		a2, 7
    call	_qsort

_end:
    li a7, 10
    ecall

# a0: int arr[]
# a1: size_t l
# a2: size_t r
_qsort:
    addi t0, a1, 1
    bge t0, a2, _qsort_end
	
    addi	sp, sp, -16
    sw		ra, 12(sp)
    sw		s0, 8(sp)
    sw		s1, 4(sp)
    sw		s2, 0(sp)
	
	mv		s0, a0
	mv		s1, a1
	mv		s2, a2
	
    call	_partition
	# Ahora a0 contiene q
	
	mv		a2, a0
	mv		a1, s1
	mv		s1, a0 # s1 ahora guardará q
	mv		a0, s0
    call	_qsort # qsort(arr, l, q)

	mv		a2, s2
	addi	a1, s1, 1
	mv		a0, s0
    call	_qsort # qsort(arr, q + 1, r)

	lw		ra, 12(sp)
	lw		s0, 8(sp)
	lw		s1, 4(sp)
	lw		s2, 0(sp)
	addi	sp, sp, 16

_qsort_end:
    ret

# a0: int arr[]
# a1: size_t l
# a2: size_t r
_partition:
    # Lomuto sobre [l, r). El pivote (r-1) queda fuera del barrido.
    addi t6, a2, -1
    slli t0, t6, 2
    add t0, a0, t0
    lw t3, 0(t0)            # valor del pivote
    mv t1, a1              # i
    mv t2, a1              # q

_partition_loop:
    bge t1, t6, _partition_finish
    slli t4, t1, 2
    add t4, a0, t4
    lw t5, 0(t4)
    blt t3, t5, _partition_next

    slli a3, t2, 2
    add a3, a0, a3
    lw a4, 0(a3)
    sw a4, 0(t4)
    sw t5, 0(a3)
    addi t2, t2, 1

_partition_next:
    addi t1, t1, 1
    j _partition_loop

_partition_finish:
    slli a3, t2, 2
    add a3, a0, a3
    lw a4, 0(a3)
    sw a4, 0(t0)
    sw t3, 0(a3)
    mv a0, t2
    ret
