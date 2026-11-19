const cout = document.getElementById('console-out');

function clog(message, style = 'co-dim') {
  const line = document.createElement('div');
  line.className = 'co-line ' + style;
  line.textContent = message;
  cout.appendChild(line);
  cout.scrollTop = cout.scrollHeight;
}

function flushOut() {
  for (const message of cpu.out) clog(message, 'co-out');
  cpu.out = [];
}

function execCmd(raw) {
  const command = raw.trim();
  if (!command) return;
  const [name, ...args] = command.split(/\s+/);
  clog('› ' + command, 'co-cmd');

  switch (name.toLowerCase()) {
    case 'step':
    case 's': {
      const count = parseCount(args[0], 1, 1_000);
      if (count === null) clog('Usa step [N], con 1 ≤ N ≤ 1000.', 'co-err');
      else doStep(count);
      break;
    }
    case 'run':
    case 'r':
      doRun();
      break;
    case 'pc':
      clog(`pc = ${p8(cpu.pc)}`, 'co-ok');
      break;
    case 'regs': {
      if (!args.length) clog(`pc = ${p8(cpu.pc)}`, 'co-ok');
      const requested = args.length ? args : RN;
      for (const name of requested) {
        const index = /^x(?:[0-9]|[12][0-9]|3[01])$/.test(name) ? Number(name.slice(1)) : RN.indexOf(name);
        if (index === -1) clog(`Registro desconocido: ${name}`, 'co-err');
        else clog(`x${index} (${RN[index]}) = ${p8(cpu.regs[index])}  (${cpu.regs[index]})`, 'co-ok');
      }
      break;
    }
    case 'mem': {
      const address = parseAddress(args[0]);
      if (address === null) {
        clog('Usa mem <dirección> [fin].', 'co-err');
        break;
      }
      const end = args[1] === undefined ? Math.min(address + 15, MAX_ADDRESS) : parseAddress(args[1]);
      if (end === null || end < address || end - address >= 4_096) {
        clog('Rango inválido. Máximo 4096 bytes por comando.', 'co-err');
        break;
      }
      renderMem(address);
      for (let row = address; row <= end; row += 16) {
        const bytes = [];
        for (let col = row; col <= Math.min(row + 15, end); col++) {
          bytes.push(cpu.r8(col).toString(16).padStart(2, '0'));
        }
        clog(`${ph(row)}: ${bytes.join(' ')}`, 'co-ok');
      }
      break;
    }
    case 'disasm':
    case 'd': {
      const address = args[0] === undefined ? cpu.pc : parseAddress(args[0]);
      const count = parseCount(args[1], 8, 256);
      if (address === null || (address & 3) !== 0 || count === null) {
        clog('Usa disasm [dirección alineada] [N], con 1 ≤ N ≤ 256.', 'co-err');
        break;
      }
      for (let i = 0; i < count && address + i * 4 <= MAX_ADDRESS; i++) {
        const pc = address + i * 4;
        const word = cpu.r32(pc);
        const [mnemonic, operands] = cpu.disasm(word, pc);
        const mark = pc === cpu.pc ? '▶' : ' ';
        clog(`${mark} ${ph(pc)}  ${ph(word)}  ${mnemonic} ${operands}`, 'co-ok');
      }
      break;
    }
    case 'reset':
      doReset();
      break;
    case 'info':
      clog(`PC=${p8(cpu.pc)} | instrucciones=${cpu.count}`, 'co-info');
      clog(`sp=${p8(cpu.regs[2])} | ra=${p8(cpu.regs[1])} | a0=${p8(cpu.regs[10])}`, 'co-info');
      reportStop();
      break;
    case 'help':
      [
        'step [N]         — ejecutar una o N instrucciones',
        'run              — ejecutar o pausar',
        'pc               — mostrar PC actual',
        'regs [reg ...]   — mostrar registros x0–x31 o nombres ABI',
        'mem <dir> [fin]  — mostrar bytes en hexadecimal',
        'disasm [dir] [N] — desensamblar instrucciones',
        'reset            — restaurar el programa cargado',
        'info             — mostrar el estado de la CPU',
      ].forEach(line => clog(line));
      break;
    default:
      clog(`Comando desconocido: "${name}". Escribe help.`, 'co-err');
  }
}

