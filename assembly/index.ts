export declare function print(message: string): void;

class TokenType {
  // Single-character tokens
  static readonly LEFT_PAREN: string = 'LEFT_PAREN';
  static readonly RIGHT_PAREN: string = 'RIGHT_PAREN';
  static readonly LEFT_BRACE: string = 'LEFT_BRACE';
  static readonly RIGHT_BRACE: string = 'RIGHT_BRACE';
  static readonly COMMA: string = 'COMMA';
  static readonly DOT: string = 'DOT';
  static readonly MINUS: string = 'MINUS';
  static readonly PLUS: string = 'PLUS';
  static readonly SEMICOLON: string = 'SEMICOLON';
  static readonly SLASH: string = 'SLASH';
  static readonly STAR: string = 'STAR';

  // One or two character tokens.
  static readonly BANG: string = 'BANG';
  static readonly BANG_EQUAL: string = 'BANG_EQUAL';
  static readonly EQUAL: string = 'EQUAL';
  static readonly EQUAL_EQUAL: string = 'EQUAL_EQUAL';
  static readonly GREATER: string = 'GREATER';
  static readonly GREATER_EQUAL: string = 'GREATER_EQUAL';
  static readonly LESS: string = 'LESS';
  static readonly LESS_EQUAL: string = 'LESS_EQUAL';

  // Literals.
  static readonly IDENTIFIER: string = 'IDENTIFIER';
  static readonly STRING: string = 'STRING';
  static readonly NUMBER: string = 'NUMBER';

  // Keywords.
  static readonly AND: string = 'AND';
  static readonly CLASS: string = 'CLASS';
  static readonly ELSE: string = 'ELSE';
  static readonly FALSE: string = 'FALSE';
  static readonly FUN: string = 'FUN';
  static readonly FOR: string = 'FOR';
  static readonly IF: string = 'IF';
  static readonly NIL: string = 'NIL';
  static readonly OR: string = 'OR';
  static readonly PRINT: string = 'PRINT';
  static readonly RETURN: string = 'RETURN';
  static readonly SUPER: string = 'SUPER';
  static readonly THIS: string = 'THIS';
  static readonly TRUE: string = 'TRUE';
  static readonly VAR: string = 'VAR';
  static readonly WHILE: string = 'WHILE';

  static readonly EOF: string = 'EOF';
}

const keywords = new Map<string, string>();
keywords.set('and', TokenType.AND);
keywords.set('class', TokenType.CLASS);
keywords.set('else', TokenType.ELSE);
keywords.set('false', TokenType.FALSE);
keywords.set('for', TokenType.FOR);
keywords.set('fun', TokenType.FUN);
keywords.set('if', TokenType.IF);
keywords.set('nil', TokenType.NIL);
keywords.set('or', TokenType.OR);
keywords.set('print', TokenType.PRINT);
keywords.set('return', TokenType.RETURN);
keywords.set('super', TokenType.SUPER);
keywords.set('this', TokenType.THIS);
keywords.set('true', TokenType.TRUE);
keywords.set('var', TokenType.VAR);
keywords.set('while', TokenType.WHILE);

type Literal = string | null;
class Token {
  type: string;
  lexeme: string;
  literal: Literal;
  line: i32;

  constructor(tokenType: string, lexeme: string, literal: Literal, line: i32) {
    this.type = tokenType;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString(): string {
    return this.type + ' ' + this.lexeme + ' ' + this.literal;
  }
}

class Reporter {
  report(line: i32, where: string, message: string): void {
    print('[line ' + line + '] Error ' + where + ': ' + message);
  }
}
class LoxCons {
  error(line: i32, message: string): void {}
}
const Lox = new LoxCons();

class Scanner {
  source: string;
  tokens: Array<Token>;
  private start: i32 = 0;
  private current: i32 = 0;
  private line: i32 = 1;

  constructor(source: string) {
    this.source = source;
    this.tokens = [];
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }
  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  private addToken(tokenType: string, literal: Literal): void {
    print(tokenType);

    this.tokens.push(
      new Token(
        tokenType,
        this.source.substring(this.start, this.current),
        literal,
        this.line
      )
    );
  }

  private string(): void {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == '\n') this.line++;
      this.advance();
    }
    if (this.isAtEnd()) {
      Lox.error(this.line, 'Unterminated string.');
      return;
    }

    // the closing "
    this.advance();

    const literal = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, literal);
  }

  private number(): void {
    while (this.isDigit(this.peek())) this.advance();

    if (this.peek() == '.' && this.isDigit(this.peekNext())) {
      // consume the "."
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }

    // TODO: parseFloat this
    const literal = this.source.substring(this.start, this.current);
    this.addToken(TokenType.NUMBER, literal);
  }

  private isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.substring(this.start, this.current);
    const t = keywords.has(text) ? keywords.get(text) : TokenType.IDENTIFIER;
    this.addToken(t, null);
  }

  private scanToken(): void {
    const c = this.advance();
    if (c == '(') {
      this.addToken(TokenType.LEFT_PAREN, null);
    } else if (c == ')') {
      this.addToken(TokenType.RIGHT_PAREN, null);
    } else if (c == '{') {
      this.addToken(TokenType.LEFT_BRACE, null);
    } else if (c == '}') {
      this.addToken(TokenType.RIGHT_BRACE, null);
    } else if (c == ',') {
      this.addToken(TokenType.COMMA, null);
    } else if (c == '.') {
      this.addToken(TokenType.DOT, null);
    } else if (c == '-') {
      this.addToken(TokenType.MINUS, null);
    } else if (c == '+') {
      this.addToken(TokenType.PLUS, null);
    } else if (c == ';') {
      this.addToken(TokenType.SEMICOLON, null);
    } else if (c == '*') {
      this.addToken(TokenType.STAR, null);
    } else if (c == '!') {
      this.addToken(
        this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG,
        null
      );
    } else if (c == '=') {
      this.addToken(
        this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
        null
      );
    } else if (c == '<') {
      this.addToken(
        this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS,
        null
      );
    } else if (c == '>') {
      this.addToken(
        this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER,
        null
      );
    } else if (c == '/') {
      if (this.match('/')) {
        // A comment goes until the end of the line.
        while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
      } else {
        this.addToken(TokenType.SLASH, null);
      }
    } else if (c == ' ' || c == '\r' || c == '\t') {
      // do nothing
    } else if (c == '\n') {
      this.line++;
    } else if (c == '"') {
      this.string();
    } else {
      if (this.isDigit(c)) {
        this.number();
      } else if (this.isAlpha(c)) {
        this.identifier();
      } else {
        Lox.error(this.line, 'unexpected character');
      }
    }
  }

  scanTokens(): Array<Token> {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line));
    return this.tokens;
  }
}

export function tokenize(source: string): Array<string> {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  return tokens.map<string>((t) => t.type);
}
