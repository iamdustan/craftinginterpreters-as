import { Console } from 'as-wasi/assembly';
import { cli, program } from './program';
import { GenerateJavaAst, GenerateAsAst } from './GenerateAst';

program
  .name('jlox-as cli')
  .version('0.0.1')
  .description('Hopefully a cli tool for Crafting Interpreters');

program
  .command('run')
  // TODO: enable options parsing
  // .options('--language', '<java|as>')
  .description('Run the Expressions codegen')
  .option('--java', 'Emit Java')
  .option('--as', 'Emit Assembyscript')
  .option('--help', '')
  .action(function (opts) {
    const outputDir = 'pretent/this/is/a/directory';
    const ast = [
      'Binary   : Expr left, Token operator, Expr right',
      'Grouping : Expr expression',
      'Literal  : Object value',
      'Unary    : Token operator, Expr right',
    ];

    if (opts.has('as')) {
      const gen = new GenerateAsAst(outputDir, 'Expr');
      Console.log(gen.defineAst(ast));
    } else {
      const gen = new GenerateJavaAst(outputDir, 'Expr');
      Console.log(gen.defineAst(ast));
    }
  });

program.parse(cli.args);
