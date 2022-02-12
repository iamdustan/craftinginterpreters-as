import { program } from './program';

class CodeGen {
  _outputDir: string;
  _baseName: string;
  constructor(outputDir: string, basename: string) {
    this._outputDir = outputDir;
    this._baseName = basename;
  }

  defineAst(types: Array<string>): string {
    const path = this._outputDir + '/' + this._baseName + '.java';
    let result = '';
    result += 'package com.craftinginterpreters.lox;';
    result += '\n';
    result += 'import java.util.List;';
    result += '\n';
    result += 'abstract class ' + this._baseName + ' {\n';
    for (let i = 0, k = types.length; i < k; ++i) {
      const type = types[i];
      result += this.defineType(type);
    }
    // types.forEach(this.defineType);
    result += '}\n';
    return result;
  }

  defineType(type: string): string {
    const className = type.split(':')[0].trim();
    const fieldList = type.split(':')[1].trim();
    let result = '';
    result +=
      '  static class ' + className + ' extends ' + this._baseName + ' {\n';

    // Constructor.
    result += '    ' + className + '(' + fieldList + ') {\n';

    // Store parameters in fields.
    const fields = fieldList.split(', ');
    for (let i = 0, k = fields.length; i < k; ++i) {
      const field = fields[i];
      const name = field.split(' ')[1];
      result += '      this.' + name + ' = ' + name + ';\n';
    }

    result += '    }\n';

    // Fields.
    result += '\n';
    for (let i = 0, k = fields.length; i < k; ++i) {
      const field = fields[i];
      result += '    final ' + field + ';\n';
    }

    result += '  }\n';
    return result;
  }
}

program
  .name('jlox-as cli')
  .version('0.0.1')
  .description('Hopefully a cli tool for Crafting Interpreters')
  .command('run', function () {
    const outputDir = 'pretent/this/is/a/directory';
    const gen = new CodeGen(outputDir, 'Expr');
    const r = gen.defineAst([
      'Binary   : Expr left, Token operator, Expr right',
      'Grouping : Expr expression',
      'Literal  : Object value',
      'Unary    : Token operator, Expr right',
    ]);
    Console.log(r);
  });

program.execute('run');
