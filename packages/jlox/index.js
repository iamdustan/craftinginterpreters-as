const AsBind = require('as-bind/dist/as-bind.cjs');
const fs = require('fs');
const readline = require('readline/promises');
const process = require('process');

const loader = require('@assemblyscript/loader');

let wasmExports;
const WasmImports = {
  index: {
    print: (message) => {
      console.log('WASM is talking', message);
    },
  },
  /* imports go here */
};
const wasm = fs.readFileSync(__dirname + '/build/debug.wasm');
// const wasm = fs.readFileSync(__dirname + '/build/optimized.wasm');
// const wasmModule = loader.instantiateSync(wasm, imports)
async function getWasm() {
  const wasmModule = await AsBind.instantiate(wasm, WasmImports);
  wasExports = wasmModule.exports;
  return wasmModule.exports;
}

/*
const jlox = wasmModule.exports
module.exports = jlox
*/

module.exports.runFile = function runFile(file) {
  console.log('runFile');
  const f = fs.readFileSync(file, 'utf8');
  return wasmModule.run(f);
};

module.exports.runPrompt = async function runPrompt(file) {
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
};

module.exports.__tokenize = async function __tokenize(input) {
  const jlox = await getWasm();
  const result = jlox.tokenize(input);
  return result;
};

module.exports.__print = async function __print() {
  const jlox = await getWasm();
  const result = jlox.print();
  console.log('print', result);
  return result;
};
