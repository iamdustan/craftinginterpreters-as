import fs from 'node:fs';
import { stdin, stdout } from 'node:process';
import * as readline from 'node:readline/promises';

async function getWasm() {
  return import('./build/debug.js');
}

export function runFile(file) {
  console.log('runFile');
  const f = fs.readFileSync(file, 'utf8');
  return wasmModule.run(f);
}

export async function runPrompt(file) {
  console.log('runPrompt');
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    // terminal: false,
  });

  const jlox = await getWasm();
  while (true) {
    const answer = await rl.question('> ');
    if (answer === 'exit' || answer === '') {
      break;
    }
    // console.log(jlox.parse(answer));
    console.log(jlox.evaluate(answer));
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
  return result;
}

export async function __printRpn() {
  const jlox = await getWasm();
  return jlox.printRpn();
}

export async function evaluate(program) {
  const jlox = await getWasm();
  return jlox.evaluate(program);
}
