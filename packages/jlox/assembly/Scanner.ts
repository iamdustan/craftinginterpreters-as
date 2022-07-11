// export declare function print(message: string): void;

export enum TokenType {
  LEFT_PAREN, // = 'LEFT_PAREN';
  RIGHT_PAREN, //= 'RIGHT_PAREN';
  LEFT_BRACE, //= 'LEFT_BRACE';
  RIGHT_BRACE, // = 'RIGHT_BRACE';
  COMMA, // = 'COMMA';
  DOT, // = 'DOT';
  MINUS, // = 'MINUS';
  PLUS, // = 'PLUS';
  SEMICOLON, // = 'SEMICOLON';
  SLASH, // = 'SLASH';
  STAR, // = 'STAR';

  // One or two character tokens.
  BANG, // = 'BANG';
  BANG_EQUAL, // = 'BANG_EQUAL';
  EQUAL, // = 'EQUAL';
  EQUAL_EQUAL, // = 'EQUAL_EQUAL';
  GREATER, // = 'GREATER';
  GREATER_EQUAL, // = 'GREATER_EQUAL';
  LESS, // = 'LESS';
  LESS_EQUAL, // = 'LESS_EQUAL';

  // Literals.
  IDENTIFIER, // = 'IDENTIFIER';
  STRING, // = 'STRING';
  NUMBER, // = 'NUMBER';

  // Keywords.
  AND, // = 'AND';
  CLASS, // = 'CLASS';
  ELSE, // = 'ELSE';
  FALSE, // = 'FALSE';
  FUN, // = 'FUN';
  FOR, // = 'FOR';
  IF, // = 'IF';
  NIL, // = 'NIL';
  OR, // = 'OR';
  PRINT, // = 'PRINT';
  RETURN, // = 'RETURN';
  SUPER, // = 'SUPER';
  THIS, // = 'THIS';
  TRUE, // = 'TRUE';
  VAR, // = 'VAR';
  WHILE, // = 'WHILE';

  EOF, // = 'EOF';
}

const tokensAsStrings = new Map<TokenType, string>();
tokensAsStrings.set(TokenType.LEFT_PAREN, 'LEFT_PAREN');
tokensAsStrings.set(TokenType.RIGHT_PAREN, 'RIGHT_PAREN');
tokensAsStrings.set(TokenType.LEFT_BRACE, 'LEFT_BRACE');
tokensAsStrings.set(TokenType.RIGHT_BRACE, 'RIGHT_BRACE');
tokensAsStrings.set(TokenType.COMMA, 'COMMA');
tokensAsStrings.set(TokenType.DOT, 'DOT');
tokensAsStrings.set(TokenType.MINUS, 'MINUS');
tokensAsStrings.set(TokenType.PLUS, 'PLUS');
tokensAsStrings.set(TokenType.SEMICOLON, 'SEMICOLON');
tokensAsStrings.set(TokenType.SLASH, 'SLASH');
tokensAsStrings.set(TokenType.STAR, 'STAR');
// One or two character tokens.
tokensAsStrings.set(TokenType.BANG, 'BANG');
tokensAsStrings.set(TokenType.BANG_EQUAL, 'BANG_EQUAL');
tokensAsStrings.set(TokenType.EQUAL, 'EQUAL');
tokensAsStrings.set(TokenType.EQUAL_EQUAL, 'EQUAL_EQUAL');
tokensAsStrings.set(TokenType.GREATER, 'GREATER');
tokensAsStrings.set(TokenType.GREATER_EQUAL, 'GREATER_EQUAL');
tokensAsStrings.set(TokenType.LESS, 'LESS');
tokensAsStrings.set(TokenType.LESS_EQUAL, 'LESS_EQUAL');

// Literals.
tokensAsStrings.set(TokenType.IDENTIFIER, 'IDENTIFIER');
tokensAsStrings.set(TokenType.STRING, 'STRING');
tokensAsStrings.set(TokenType.NUMBER, 'NUMBER');

// Keywords.
tokensAsStrings.set(TokenType.AND, 'AND');
tokensAsStrings.set(TokenType.CLASS, 'CLASS');
tokensAsStrings.set(TokenType.ELSE, 'ELSE');
tokensAsStrings.set(TokenType.FALSE, 'FALSE');
tokensAsStrings.set(TokenType.FUN, 'FUN');
tokensAsStrings.set(TokenType.FOR, 'FOR');
tokensAsStrings.set(TokenType.IF, 'IF');
tokensAsStrings.set(TokenType.NIL, 'NIL');
tokensAsStrings.set(TokenType.OR, 'OR');
tokensAsStrings.set(TokenType.PRINT, 'PRINT');
tokensAsStrings.set(TokenType.RETURN, 'RETURN');
tokensAsStrings.set(TokenType.SUPER, 'SUPER');
tokensAsStrings.set(TokenType.THIS, 'THIS');
tokensAsStrings.set(TokenType.TRUE, 'TRUE');
tokensAsStrings.set(TokenType.VAR, 'VAR');
tokensAsStrings.set(TokenType.WHILE, 'WHILE');

tokensAsStrings.set(TokenType.EOF, 'EOF');

function tokenToString(type: TokenType): string {
  return tokensAsStrings.get(type);
}

const keywords = new Map<string, TokenType>();
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
export class Token {
  type: TokenType;
  lexeme: string;
  literal: Literal;
  line: i32;

  constructor(
    tokenType: TokenType,
    lexeme: string,
    literal: Literal,
    line: i32
  ) {
    this.type = tokenType;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString(): string {
    const literal = this.literal;
    if (literal) {
      return tokenToString(this.type) + ' ' + this.lexeme + ' ' + literal;
    } else {
      return tokenToString(this.type) + ' ' + this.lexeme;
    }
  }
}

/*
class Reporter {
  report(line: i32, where: string, message: string): void {
    print('[line ' + line + '] Error ' + where + ': ' + message);
  }
  static error(token: Token, message: string): void {
    if (token.type == TokenType.EOF) {
      Lox.report(token.line, ' at end', message);
    } else {
      Lox.report(token.line, " at '" + token.lexeme + "'", message);
    }
  }
}
*/
class LoxCons {
  report(line: i32, where: string, message: string): void {
    console.log(
      '[line ' + line.toString() + '] Error ' + where + ': ' + message
    );
  }

  error(line: i32, message: string): void {
    Lox.report(line, '', message);
  }

  static error(token: Token, message: string): void {
    if (token.type == TokenType.EOF) {
      Lox.report(token.line, ' at end', message);
    } else {
      Lox.report(token.line, " at '" + token.lexeme + "'", message);
    }
  }
}
export const Lox = new LoxCons();

export class Scanner {
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

  private peekPrev(): string {
    return this.source.charAt(this.current - 1);
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  private addToken(tokenType: TokenType, literal: Literal): void {
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
      if (this.match('*')) {
        // multiline comments go until */
        // caveat that this can be escaped or inside a commented line
        // and I’m not going to add all those details
        while (true) {
          if (this.peek() == '*') {
            if (this.peekPrev() == '\\') {
              this.advance();
              this.advance();
            } else if (this.peekNext() == '/') {
              // after we bail out of the loop, consume the two characters
              this.advance();
              this.advance();
              break;
            }
          }
          this.advance();
        }
      } else if (this.match('/')) {
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

  __debugAsStrings(): Array<string> {
    return this.tokens.map<string>((t) => tokenToString(t.type));
  }
}
