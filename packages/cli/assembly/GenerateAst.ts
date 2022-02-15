/**
 * Generates the Java AST as defined in the book
 */
export class GenerateJavaAst {
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

// converts the input ast structure from Java style to AssemblyScript style
function fieldListToAsParams(str: string): string {
  return str.split(', ').reduce((str, param, i) => {
    return str + (i > 0 ? ', ' : '') + param.split(' ').reverse().join(': ');
  }, '');
}

/**
 * Generates an Assemblyscript AST similar to the book
 */
export class GenerateAsAst {
  _outputDir: string;
  _baseName: string;
  constructor(outputDir: string, basename: string) {
    this._outputDir = outputDir;
    this._baseName = basename;
  }

  defineAst(types: Array<string>): string {
    const path = this._outputDir + '/' + this._baseName + '.java';
    let result = '';
    result += 'class ' + this._baseName + ' {\n';
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
    const fields = fieldList.split(', ');

    let result = '';
    result += '  static class ' + className + '{\n';
    // Fields.
    for (let i = 0, k = fields.length; i < k; ++i) {
      const field = fields[i];
      result += '    this.' + fieldListToAsParams(field) + ';\n';
    }
    result += '\n';

    // Constructor.
    result += '    constructor(' + fieldListToAsParams(fieldList) + ') {\n';
    // Store parameters in fields.
    for (let i = 0, k = fields.length; i < k; ++i) {
      const field = fields[i];
      const name = field.split(' ')[1];
      result += '      this.' + name + ' = ' + name + ';\n';
    }

    result += '    }\n';

    result += '  }\n';
    return result;
  }
}
