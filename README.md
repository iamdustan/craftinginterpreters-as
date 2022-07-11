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


### Debugging notes

AssemblyScript products a .js file with it’s esm support. I’m manually renaminmg
this file after each build to let my JavaScript pick it up. Probably a real
reason for this but I’m retired.

## Part 1: TODO
[Chapter 6 challenges)[http://craftinginterpreters.com/parsing-expressions.html]
- [ ] comma operator
- [ ] ternary operators
- [ ] error productions for each binary operator without a left-hand operand


