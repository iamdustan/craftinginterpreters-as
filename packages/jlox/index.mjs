import fs from 'node:fs';
import * as process from 'node:child_process';
import * as readline from 'node:readline/promises';

async function getWasm() {
  return await import('./build/debug.mjs');
}

export function runFile(file) {
  console.log('runFile');
  const f = fs.readFileSync(file, 'utf8');
  return wasmModule.run(f);
}

export async function runPrompt(file) {
  console.log('runPrompt');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  while (true) {
    const answer = await rl.question('> ');
    if (answer === 'exit' || answer === '') {
      break;
    }
    console.log(answer);
  }
  rl.close();
  process.exit(0);
}

export async function __tokenize(input) {
  const jlox = await getWasm();
  const result = jlox.tokenize(input);
  return result;
}

export async function __print() {
  const jlox = await getWasm();
  const result = jlox.print();
  console.log('print', result);
  return result;
}
