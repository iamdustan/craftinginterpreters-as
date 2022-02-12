const test = require('ava');
const m = require('..');

test('tokenizer: comments are dropped', async (t) => {
  const input = '// this is a comment';
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
