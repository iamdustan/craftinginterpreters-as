import { AstPrinter } from './AstPrinter';
import { AstRpnPrinter } from './__ExperimentalRpnPrinter';
import { Binary, Unary, Literal, Grouping } from './Expr';
import { Parser } from './Parser';
import { StringInterpreter, NumberInterpreter } from './Interpreter';
import { Token, TokenType, Scanner } from './Scanner';

export function print(): string {
  const expr = new Binary(
    new Unary(new Token(TokenType.MINUS, '-', null, 1), new Literal<f64>(123)),
    new Token(TokenType.STAR, '*', null, 1),
    new Grouping(new Literal<f64>(45.67))
  );

  return new AstPrinter().print(expr);
}

export function printRpn(): string {
  const e1 = new Binary(
    new Literal<f64>(1),
    new Token(TokenType.PLUS, '+', null, 1),
    new Literal<f64>(2)
  );
  const e2 = new Binary(
    new Literal<f64>(4),
    new Token(TokenType.MINUS, '-', null, 1),
    new Literal<f64>(3)
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
  const expression = parser.parse();
  if (!expression) {
    throw new Error('broke');
  }
  // TODO: error handling
  return new AstPrinter().print(expression);
}

export function evaluate(source: string): string {
  console.log('evaluate(' + source + ')');
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  const parser = new Parser(tokens);
  const expression = parser.parse();
  if (!expression) {
    throw new Error('broke');
  }
  // return new NumberInterpreter().evaluate(expression).toString();
  return new StringInterpreter().evaluate(expression).toString();
}
