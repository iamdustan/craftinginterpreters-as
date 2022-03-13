import { AstPrinter } from './AstPrinter';
import { Binary, Unary, Literal, Grouping } from './Expr';
import { Token, TokenType, Scanner } from './Scanner';

export function print(): string {
  const expr = new Binary(
    new Unary(new Token(TokenType.MINUS, '-', null, 1), new Literal('123')),
    new Token(TokenType.STAR, '*', null, 1),
    new Grouping(new Literal('45.67'))
  );

  return new AstPrinter().print(expr);
}
export function tokenize(source: string): Array<string> {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  return tokens.map<string>((t) => t.type);
}
