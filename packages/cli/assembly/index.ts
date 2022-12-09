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
    const exprNodes = [
      'Binary         : Expr left, Token operator, Expr right',
      'Grouping       : Expr expression',
      'Literal        : Object value',
      'Unary          : Token operator, Expr right',
      'Variable       : Token name',
    ];
    const stmtNodes = [
      'Expression : Expr expression',
      'Print      : Expr expression',
      'Var        : Token name, Expr initializer',
    ];

    if (opts.has('as')) {
      // console.log(new GenerateAsAst(outputDir, 'Expr').defineAst(exprNodes));
      console.log(new GenerateAsAst(outputDir, 'Stmt').defineAst(stmtNodes));
    } else {
      // console.log(new GenerateJavaAst(outputDir, 'Expr').defineAst(exprNodes));
      // console.log(new GenerateAsAst(outputDir, 'Stmt').defineAst(stmtNodes));
    }
  });

program.parse(cli.args);
