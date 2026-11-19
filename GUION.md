# Guion del video · 5 minutos

## 0:00–0:40 · Presentación

Abre `index.html`. “Este es mi simulador RISC-V RV32I. Lo hice en JavaScript y corre en el navegador. A la izquierda puedo ver los registros, en el centro el desensamblado y la memoria, y a la derecha está la consola. Cada paso lee la instrucción del PC, la decodifica y actualiza el estado.”

## 0:40–1:40 · riscvtest

Pulsa **Cargar .bin** y selecciona `examples/riscvtest.bin`. “El binario se carga desde cero. Con un **Step**, el PC pasa de `0x0` a `0x4` y `x2` queda en 5.” Pulsa **Run** y escribe `mem 0x64 0x67`. “Los cuatro bytes que se escribieron representan el número 25.”

## 1:40–2:40 · Quicksort

Pulsa **quicksort** y escribe `step 16`. Muestra el arreglo original en `0x1000`. Pulsa **Run** y escribe `mem 0x1000 0x101b`. “Ahora los valores se ordenaron en la misma dirección: 1, 2, 3, 4, 6, 8 y 9.”

## 2:40–3:30 · Árbol simétrico

Pulsa **árbol simétrico**, **Run** y escribe `regs a0`. “El programa compara los nodos espejo del árbol. Como coinciden, devuelve 1 en `a0`.” Señala el registro y los valores del árbol en memoria.

## 3:30–4:40 · Little-endian

Pulsa **Little-endian**, **Run**, y escribe `mem 0x90001000 0x90001003`. “La palabra `0x80FF7F01` queda guardada como `01 7F FF 80`, empezando por el byte menos significativo.” Escribe `regs t2 t3`. “`lb` interpreta `0x80` con signo y devuelve −128, mientras que `lbu` lo lee sin signo y devuelve 128.”

## 4:40–5:00 · Cierre

“Con estos cuatro ejemplos mostré la carga de binarios, el paso a paso y cómo revisar los resultados en registros y memoria.”
