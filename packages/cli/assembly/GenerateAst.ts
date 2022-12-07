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
    // const path = this._outputDir + '/' + this._baseName + '.java';
    let result = '';
    result += 'package com.craftinginterpreters.lox;';
    result += '\n';
    result += 'import java.util.List;';
    result += '\n';
    result += 'abstract class ' + this._baseName + ' {\n';
    result += this.defineVisitor(types);

    // the ast class
    for (let i = 0, k = types.length; i < k; ++i) {
      const type = types[i];
      result += this.defineType(type);
    }

    // The base accept() method.
    result += '\n';
    result += '  abstract <R> R accept(Visitor<R> visitor);\n';

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

    // visitor
    result += '\n';
    result += '    @Override\n';
    result += '    <R> R accept(Visitor<R> visitor) {\n';
    result +=
      '      return visitor.visit' + className + this._baseName + '(this);\n';

    result += '    }\n';
    result += '  }\n';
    return result;
  }

  defineVisitor(types: Array<string>): string {
    let result = '  interface Visitor<R> {\n';
    for (let i = 0, k = types.length; i < k; ++i) {
      const t = types[i];
      const typeName = t.split(':')[0].trim();
      result +=
        '    R visit' +
        typeName +
        this._baseName +
        '(' +
        typeName +
        ' ' +
        this._baseName.toLowerCase() +
        ');\n';
    }

    return result + '  }\n';
  }
}

function replaceObjectType(n: string): string {
  return n == 'Object' ? 'Variant' : n;
}
// converts the input ast structure from Java style to AssemblyScript style
function fieldListToAsParams(str: string): string {
  return str.split(', ').reduce((str, param, i) => {
    return (
      str +
      (i > 0 ? ', ' : '') +
      param
        .split(' ')
        .reverse()
        .map<string>((n) => replaceObjectType(n))
        .join(': ')
    );
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
    // const path = this._outputDir + '/' + this._baseName + '.java';
    let result = '';
    result += "import { Variant } from 'as-variant/assembly';\n\n";
    result += "import { Token } from './Scanner';\n\n";

    result += this.defineVisitor(types);

    result += 'export abstract class ' + this._baseName + ' {\n';
    result += '  abstract accept<R>(visitor: Visitor<R>): R;\n';
    result += '}\n\n';

    for (let i = 0, k = types.length; i < k; ++i) {
      const type = types[i];
      result += this.defineType(type);
    }
    return result;
  }

  defineType(type: string): string {
    const className = type.split(':')[0].trim();
    const fieldList = type.split(':')[1].trim();
    const fields = fieldList.split(', ');

    let result = '';

    result +=
      'export class ' + className + ' extends ' + this._baseName + ' {\n';
    // Fields.
    for (let i = 0, k = fields.length; i < k; ++i) {
      const field = fields[i];
      result += '  ' + fieldListToAsParams(field) + ';\n';
    }
    result += '\n';

    // Constructor.
    result += '  constructor(' + fieldListToAsParams(fieldList) + ') {\n';
    result += '    super();\n';
    // Store parameters in fields.
    for (let i = 0, k = fields.length; i < k; ++i) {
      const field = fields[i];
      const name = field.split(' ')[1];
      result += '    this.' + name + ' = ' + name + ';\n';
    }

    result += '  }\n';

    result += '\n';
    result += '  accept<R>(visitor: Visitor<R>): R {\n';
    result +=
      '    return visitor.visit' + className + this._baseName + '(this);\n';

    result += '  }\n';
    result += '}\n';

    return result;
  }

  defineVisitor(types: Array<string>): string {
    let result = '';
    const baseName = this._baseName;

    result += 'export interface Visitor<R> {\n';
    for (let i = 0, k = types.length; i < k; ++i) {
      const type = types[i];
      const typeName = type.split(':')[0].trim();
      result +=
        '  visit' +
        typeName +
        baseName +
        '(' +
        baseName.toLowerCase() +
        ': ' +
        typeName +
        '): R;\n';
    }

    result += '}\n\n';
    return result;
  }
}
