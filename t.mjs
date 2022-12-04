import * as m from './packages/jlox/index.js';

const input = `var language = "lox";`;

// const val = await m.__tokenize(input);
// const val = await m.__printRpn();
const val = await m.runPrompt();
console.log('Input:\n  ', input);
console.log('Output:\n  ', val);
