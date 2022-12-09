import { Variant } from 'as-variant/assembly';
import { AstPrinter } from './AstPrinter';
import { AstRpnPrinter } from './__ExperimentalRpnPrinter';
import { Binary, Unary, Literal, Grouping } from './Expr';
import { Parser } from './Parser';
import { Interpreter } from './Interpreter';
import { Token, TokenType, Scanner } from './Scanner';

export function print(): string {
  const expr = new Binary(
    new Unary(new Token(TokenType.MINUS, '-', null, 1), new Literal(Variant.from(123))),
    new Token(TokenType.STAR, '*', null, 1),
    new Grouping(new Literal(Variant.from(45.67)))
  );

  return new AstPrinter().print(expr);
}

export function printRpn(): string {
  const e1 = new Binary(
    new Literal(Variant.from(1)),
    new Token(TokenType.PLUS, '+', null, 1),
    new Literal(Variant.from(2))
  );
  const e2 = new Binary(
    new Literal(Variant.from(4)),
    new Token(TokenType.MINUS, '-', null, 1),
    new Literal(Variant.from(3))
  );
  const expr = new Binary(
    new Grouping(e1),
    new Token(TokenType.STAR, '*', null, 1),
    new Grouping(e2)
  );

  return new AstRpnPrinter().print(expr);
}
export function tokenize(source: string): Array<string> {
  const scanner = new Scanner(source);
  scanner.scanTokens();
  return scanner.__debugAsStrings();
}

export function parse(source: string): string {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  const parser = new Parser(tokens);
  const statements = parser.parse();
  // TODO: error handling?
  if (!statements) {
    throw new Error('broke');
  }
  return new AstPrinter().print(statements[0].getExpression());
}

export function evaluate(source: string): string {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  const parser = new Parser(tokens);
  const statements = parser.parse();
  if (!statements) {
    throw new Error('broke');
  }
  const interpreter = new Interpreter();
  const r = interpreter.evaluate(statements[0].getExpression());
  return r.is<string>() ? r.get<string>() : r.getUnchecked<f64>().toString();
}

export function interpret(source: string): void {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  const parser = new Parser(tokens);
  const expression = parser.parse();
  if (!expression) {
    throw new Error('broke');
  }
  const interpreter = new Interpreter();
  interpreter.interpret(expression);
}
