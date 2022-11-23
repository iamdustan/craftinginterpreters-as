import test from 'ava';
import * as m from '../index.js';

test('tokenizer: single line comments are dropped', async (t) => {
  const input = '// this is a comment';
  t.deepEqual(await m.__tokenize(input), ['EOF']);
});

test('tokenizer: multiline comments are dropped', async (t) => {
  const input = '/* this is a comment\n   that spans multiple\n   lines */';
  t.deepEqual(await m.__tokenize(input), ['EOF']);
});
test('tokenizer: multiline comments with inlines are dropped', async (t) => {
  const input = '/** this is a comment\n   // that spans multiple\n   lines *********************************/';
  t.deepEqual(await m.__tokenize(input), ['EOF']);
});

test('tokenizer: multiline comments with escapes are dropped', async (t) => {
  const input = '/** this is a comment\n   //\\*/ that spans multiple\n   lines *********************************/';
  t.deepEqual(await m.__tokenize(input), ['EOF']);
});


test('tokenizer: can do grouping things', async (t) => {
  const input = '(( )){}';
  t.deepEqual(await m.__tokenize(input), [
    'LEFT_PAREN',
    'LEFT_PAREN',
    'RIGHT_PAREN',
    'RIGHT_PAREN',
    'LEFT_BRACE',
    'RIGHT_BRACE',
    'EOF',
  ]);
});

test('tokenizer', async (t) => {
  const input = `var language = "lox";`;
  t.deepEqual(await m.__tokenize(input), [
    'VAR',
    'IDENTIFIER', // 'language',
    'EQUAL', // '=',
    'STRING', // '"lox"',
    'SEMICOLON',
    'EOF',
  ]);
});

test('AstPrinter can print', async (t) => {
  t.deepEqual(await m.__print(), '(* (- 123) (group 45.67))');
});

test('AstRpnPrinter can print RPN', async (t) => {
  t.deepEqual(await m.__printRpn(), '1 2 + 4 3 - *');
});

test('evaluator can ...evaluate math?', async (t) => {
  t.deepEqual(await m.evaluate('1 + 2'), '3.0');
});
test('evaluator can ...evaluate strings?', async (t) => {
  t.deepEqual(await m.evaluate('"hello" + " world"'), 'hello world');
});
