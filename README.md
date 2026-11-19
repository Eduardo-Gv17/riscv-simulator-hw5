# Simulador RISC-V RV32I · CS3051

Simulador en JavaScript, HTML y CSS para la tarea 5. Carga binarios crudos en `0x00000000`, implementa las 37 instrucciones del anexo A y permite ejecutar paso a paso e inspeccionar el PC, los 32 registros y la memoria little-endian.

## Uso

1. Descarga el repositorio y abre `index.html` en el navegador.
2. Carga un `.bin` de `examples/` o selecciona uno de los ejemplos en la barra.
3. Usa **Step** para una instrucción, **Run** para continuar y **Reset** para reiniciar el programa.

| Ejemplo | Resultado |
| --- | --- |
| riscvtest | `19 00 00 00` (25) en `0x64` |
| Quicksort | Arreglo ordenado `[1, 2, 3, 4, 6, 8, 9]` desde `0x1000` |
| Árbol simétrico | `a0 = 1` |
| Little-endian | `01 7F FF 80` desde `0x90001000` |

Cada binario se incluye con su fuente ensamblador. Los primeros tres ejemplos se adaptaron de los programas enlazados en la consigna. [riscvtest](https://pastebin.com/pKuqWTLh) · [Quicksort](https://pastebin.com/MmQzpFyR) · [Árbol](https://pastebin.com/R74Uqc68)

[Guion del video](GUION.md)
