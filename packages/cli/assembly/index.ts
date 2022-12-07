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
    ];
    const stmtNodes = [
      'Expression : Expr expression',
      'Print      : Expr expression',
    ];

    if (opts.has('as')) {
      const exprGen = new GenerateAsAst(outputDir, 'Expr');
      console.log(exprGen.defineAst(exprNodes));
      // const stmtGen = new GenerateAsAst(outputDir, 'Stmt');
      // console.log(stmtGen.defineAst(stmtNodes));
    } else {
      const exprGen = new GenerateJavaAst(outputDir, 'Expr');
      console.log(exprGen.defineAst(exprNodes));
      // const stmtGen = new GenerateAsAst(outputDir, 'Stmt');
      // console.log(stmtGen.defineAst(stmtNodes));
    }
  });

program.parse(cli.args);
