import { cli, program } from './program';
import { GenerateAsAst as GenerateAst } from './GenerateAst';

program
  .name('jlox-as cli')
  .version('0.0.1')
  .description('Hopefully a cli tool for Crafting Interpreters');

program
  .command('run')
  .description('Run the Java codegen')
  .action(function () {
    const outputDir = 'pretent/this/is/a/directory';
    const gen = new GenerateAst(outputDir, 'Expr');
    const r = gen.defineAst([
      'Binary   : Expr left, Token operator, Expr right',
      'Grouping : Expr expression',
      'Literal  : Object value',
      'Unary    : Token operator, Expr right',
    ]);
    Console.log(r);
  });

program.parse(cli.args);
