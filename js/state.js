// Estado de la sesión.
const cpu = new CPU();
let prev = new Int32Array(32);
let memAddr = 0;
let currentProgram = null;
let activeRun = null;

const p8 = value => '0x' + (value >>> 0).toString(16).padStart(8, '0');
const ph = value => p8(value).slice(2);

function parseAddress(input) {
  const text = (input ?? '').trim();
  if (!/^(?:0x[0-9a-f]+|\d+)$/i.test(text)) return null;
  const address = Number(text);
  return address <= MAX_ADDRESS ? address : null;
}

function parseCount(input, fallback, limit) {
  if (input === undefined) return fallback;
  const count = Number(input);
  return /^\d+$/.test(input) && count >= 1 && count <= limit ? count : null;
}

