/**
 *
expression     → equality ;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           → factor ( ( "-" | "+" ) factor )* ;
factor         → unary ( ( "/" | "*" ) unary )* ;
unary          → ( "!" | "-" ) unary
               | primary ;
primary        → NUMBER | STRING | "true" | "false" | "nil"
               | "(" expression ")" ;
 *
 */
import { Variant} from 'as-variant/assembly';
import { Token, TokenType, Lox } from './Scanner';
import * as Expr from './Expr';

export class Parser {
  tokens: Array<Token> = [];
  current: i32 = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  isAtEnd(): boolean {
    return this.peek().type == TokenType.EOF;
  }

  check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }
  advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }
  previous(): Token {
    return this.tokens[this.current - 1];
  }
  peek(): Token {
    return this.tokens[this.current];
  }
  match(types: Array<TokenType>): boolean {
    for (let i = 0; i < types.length; i++) {
      if (this.check(types[i])) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type == TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          // should this be a return or continue?
          return;
      }

      this.advance();
    }
  }

  //
  // GRAMMAR RULES:: RETURN EXPRESSIONS
  //
  expression(): Expr.Expr {
    return this.equality();
  }
  term(): Expr.Expr {
    let expr = this.factor();

    while (this.match([TokenType.MINUS, TokenType.PLUS])) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.factor();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  equality(): Expr.Expr {
    let expr: Expr.Expr = this.comparison();
    while (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.comparison();
      expr = new Expr.Binary(expr, operator, right);
    }
    return expr;
  }
  comparison(): Expr.Expr {
    // TODO
    let expr = this.term();

    while (
      this.match([
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      ])
    ) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.term();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }
  factor(): Expr.Expr {
    let expr: Expr.Expr = this.unary();

    while (this.match([TokenType.SLASH, TokenType.STAR])) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.unary();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }
  unary(): Expr.Expr {
    if (this.match([TokenType.BANG, TokenType.MINUS])) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.unary();
      return new Expr.Unary(operator, right);
    }

    return this.primary();
  }

  primary(): Expr.Expr {
    if (this.match([TokenType.FALSE])) return new Expr.Literal(Variant.from(false));
    if (this.match([TokenType.TRUE])) return new Expr.Literal(Variant.from(true));
    // hmm...is this weird?
    if (this.match([TokenType.NIL])) return new Expr.Literal(Variant.from('NIL'));

    if (this.match([TokenType.NUMBER])) {
      const literal = this.previous().literal;
      if (literal == null) {
        throw new Error(
          'unexpected parser error. This is a bug in the implementation'
        );
      }

      return new Expr.Literal(Variant.from(parseFloat(literal)));
    } else if (this.match([TokenType.STRING])) {
      const literal = this.previous().literal;
      return new Expr.Literal(Variant.from(literal as string));
    }

    if (this.match([TokenType.LEFT_PAREN])) {
      const expr: Expr.Expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new Expr.Grouping(expr);
    }
    throw this.error(this.peek(), 'Expect expression.');
  }

  //
  // ERROR HANDLING STUFF
  //
  //
  consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();

    throw this.error(this.peek(), message);
  }

  error(token: Token, message: string): ParseError {
    Lox.error(token, message);
    return new ParseError();
  }

  parse(): Expr.Expr {
    // TODO: error handling?
    return this.expression();
  }
}

class ParseError extends Error {}
