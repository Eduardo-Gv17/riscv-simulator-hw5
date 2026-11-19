const RUN_LIMIT = 5_000_000;
const RUN_CHUNK = 10_000;
let loadRequest = 0;

function stopRun() {
  if (!activeRun) return;
  activeRun = null;
  flushOut();
  renderAll();
}

function reportStop() {
  if (cpu.fault) clog(cpu.fault, 'co-err');
  else if (cpu.halted) clog(cpu.stopReason, 'co-info');
}

function ensureProgram() {
  if (currentProgram) return true;
  clog('Primero carga un archivo o un demo.', 'co-err');
  return false;
}

function doStep(n = 1) {
  if (!ensureProgram() || cpu.halted) return;
  stopRun();
  prev.set(cpu.regs);
  for (let i = 0; i < n && !cpu.halted; i++) cpu.step();
  flushOut();
  renderAll();
  clog(`PC = ${p8(cpu.pc)}  |  Instrucciones: ${cpu.count}`);
  reportStop();
}

function doRun() {
  if (activeRun) {
    stopRun();
    clog('Ejecución pausada.', 'co-info');
    return;
  }
  if (!ensureProgram() || cpu.halted) return;

  const run = { startingCount: cpu.count };
  activeRun = run;
  prev.set(cpu.regs);

  function tick() {
    if (activeRun !== run) return;
    const end = Math.min(cpu.count + RUN_CHUNK, run.startingCount + RUN_LIMIT);
    while (!cpu.halted && cpu.count < end) cpu.step();
    const executed = cpu.count - run.startingCount;
    if (cpu.halted || executed >= RUN_LIMIT) {
      stopRun();
      clog(`Run: ${executed.toLocaleString()} instrucciones.`, 'co-info');
      if (cpu.halted) reportStop();
      else clog('Pausa al alcanzar el límite de 5 000 000 por ejecución.', 'co-info');
      return;
    }
    flushOut();
    renderAll();
    setTimeout(tick, 0);
  }

  renderStatus();
  setTimeout(tick, 0);
}

function restoreProgram() {
  stopRun();
  cpu.reset();
  if (currentProgram) cpu.load(currentProgram.bytes);
  prev.set(cpu.regs);
  memAddr = currentProgram?.memoryView ?? 0;
  renderAll();
}

function loadProgram(bytes, name, memoryView = 0) {
  if (bytes.length === 0) throw new Error('El archivo está vacío.');
  if (bytes.length > MAX_ADDRESS + 1) throw new Error('El binario no cabe en la memoria.');
  if (bytes[0] === 0x7F && bytes[1] === 0x45 && bytes[2] === 0x4C && bytes[3] === 0x46) {
    throw new Error('El archivo es ELF. Carga el binario crudo exportado como Raw.');
  }

  currentProgram = { bytes, name, memoryView };
  restoreProgram();
  clog(`"${name}" cargado en 0x00000000 (${bytes.length} bytes).`, 'co-info');
}

function loadDemo(demo) {
  loadRequest++;
  loadProgram(demo.bytes, demo.name, demo.memoryView);
  clog(demo.hint);
}

function doReset() {
  loadRequest++;
  restoreProgram();
  clog(currentProgram ? `"${currentProgram.name}" reiniciado desde 0x00000000.` : 'Simulador reiniciado.', 'co-info');
}

const byId = id => document.getElementById(id);
byId('btn-step').onclick = () => doStep();
byId('btn-step10').onclick = () => doStep(10);
byId('btn-step100').onclick = () => doStep(100);
byId('btn-run').onclick = doRun;
byId('btn-reset').onclick = doReset;
byId('btn-demo').onclick = () => loadDemo(DEMOS.riscvtest);
byId('btn-demo-qs').onclick = () => loadDemo(DEMOS.quicksort);
byId('btn-demo-tree').onclick = () => loadDemo(DEMOS.tree);
byId('btn-demo-endian').onclick = () => loadDemo(DEMOS.endian);

byId('file-input').onchange = async event => {
  const input = event.target;
  const file = input.files[0];
  if (!file) return;
  input.value = '';
  const request = ++loadRequest;
  try {
    if (file.size > MAX_ADDRESS + 1) throw new Error('El binario no cabe en la memoria.');
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (request === loadRequest) loadProgram(bytes, file.name);
  } catch (error) {
    if (request === loadRequest) clog(`No se pudo cargar "${file.name}": ${error.message}`, 'co-err');
  }
};

byId('btn-mem-go').onclick = () => {
  const address = parseAddress(byId('mem-addr').value);
  if (address === null) clog('Dirección inválida. Usa decimal o hexadecimal entre 0 y 0xFFFFFFFF.', 'co-err');
  else renderMem(address);
};
byId('btn-mem-pc').onclick = () => renderMem(cpu.pc);
byId('btn-mem-64').onclick = () => renderMem(0x64);
byId('btn-mem-1000').onclick = () => renderMem(0x1000);
byId('mem-addr').addEventListener('keydown', event => {
  if (event.key === 'Enter') byId('btn-mem-go').click();
});
byId('console-input').addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  execCmd(event.target.value);
  event.target.value = '';
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && activeRun) {
    stopRun();
    clog('Ejecución pausada.', 'co-info');
    return;
  }
  if (document.activeElement?.tagName === 'INPUT') return;
  const actions = { F7: doStep, F8: doRun, F9: doReset };
  const action = actions[event.key];
  if (action) {
    event.preventDefault();
    action();
  }
});

