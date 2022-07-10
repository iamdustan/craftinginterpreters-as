# Crafting Interpreters in AssemblyScript


This README is just for Dustan to remember how to work on this.

This is using AssemblyScript v20.x.


## Part 1

**packages/cli**

This is the codegen portion of the book, used for generating the syntax tokens.


Useful commands:

- `wasmtime packages/cli/build/debug.wasm run --as`: generate assemblyscript
  source
- `npm run cli:build:watch` generate the required `debug.wasm` file for codegen
- `npm run codegen`: regenerate `packages/jlox/assembly/Expr.ts` from current
  defintion



**packages/jlox**

- TODO
