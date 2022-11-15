import { TokenType } from './Scanner';
import * as Expr from './Expr';

export class Interpreter implements Expr.Visitor<T> {
  evaluate(expr: Expr.Expr) {
    return expr.accept(this);
  }
  private isTruthy<T>(obj: T): boolean {
    if (obj == null) return false;
    if (obj instanceof Boolean) return obj === true;
    return true;
  }
  private isEqual<A, B>(a: A, b: B): boolean {
    if ((a == null) & (b == null)) return true;
    if (a == null) return false;
    return a == b;
  }

  // Since the Literal type only returns strings currently, this will need to be
  // reworked...
  visitStringLiteralExpr(expr: Expr.Literal): string {
    return expr.value;
  }
  visitBooleanLiteralExpr(expr: Expr.Literal): boolean {
    return expr.value;
  }
  visitNumberLiteralExpr(expr: Expr.Literal): f64 {
    return expr.value;
  }
  visitGroupingExpr(expr: Expr.Grouping) {
    return this.evaluate(expr.expression);
  }
  visitUnaryExpr(expr: Expr.Unary) {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        return -right;
    }

    // unreachable;
    return null;
  }
  visitBinaryExpr(expr: Expr.Binary) {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        return left - right;
      case TokenType.PLUS:
        // TODO: do I need to handle number types and string types differently?
        return left + right;
      case TokenType.SLASH:
        return left / right;
      case TokenType.STAR:
        return left * right;

      // TODO: should these all be f64s?
      case TokenType.GREATER:
        return left > right;
      case TokenType.GREATER_EQUAL:
        return left >= right;
      case TokenType.LESS:
        return left > right;
      case TokenType.LESS_EQUAL:
        return left >= right;
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
    }
  }
}
