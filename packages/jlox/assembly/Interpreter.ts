import { Variant } from 'as-variant/assembly';
import { TokenType } from './Scanner';
import * as Expr from './Expr';

export class StringInterpreter implements Expr.Visitor<string> {
  evaluate(expr: Expr.Expr): string {
    return expr.accept<string>(this);
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

  visitStringLiteralExpr(expr: Expr.Literal<string>): string {
    return expr.value;
  }
  visitBooleanLiteralExpr(expr: Expr.Literal<boolean>): string {
    return expr.value == true ? 'true' : 'false';
  }
  visitNumberLiteralExpr(expr: Expr.Literal<f64>): string {
    return expr.value.toString();
  }
  visitUnaryExpr(expr: Expr.Unary): string {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right) ? 'true' : 'false';
      case TokenType.MINUS:
    }

    // unreachable
    throw new TypeError('compiler error probably');
  }
  visitGroupingExpr(expr: Expr.Grouping): string {
    if (true) {
      throw new Error(
        'unimplmented()! handle a GroupingExpr in the NumberInterpreter'
      );
    }
    unreachable();
  }
  visitBinaryExpr(expr: Expr.Binary): string {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.PLUS:
        return left + right;
      case TokenType.MINUS:
      case TokenType.SLASH:
      case TokenType.STAR:
        throw new TypeError('invalid string operations');

      // TODO: how to handle these in the StringInterpreter?
      case TokenType.GREATER:
      case TokenType.GREATER_EQUAL:
      case TokenType.LESS:
      case TokenType.LESS_EQUAL:
      case TokenType.BANG_EQUAL:
      case TokenType.EQUAL_EQUAL:
      default:
        throw new TypeError('dustan doesn’t know how to computer');
    }
  }
}

export class NumberInterpreter implements Expr.Visitor<f64> {
  evaluate(expr: Expr.Expr): f64 {
    return expr.accept<f64>(this);
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

  visitStringLiteralExpr(expr: Expr.Literal<string>): f64 {
    if (true) {
      throw new Error(
        'Attempted to handle a StringLiteral in the NumberInterpreter'
      );
    }
    return 0;
  }
  visitBooleanLiteralExpr(expr: Expr.Literal<boolean>): f64 {
    if (true) {
      throw new Error(
        'Attempted to handle a BooleanLiteral in the NumberInterpreter'
      );
    }
    return 0;
  }
  visitNumberLiteralExpr(expr: Expr.Literal<f64>): f64 {
    return expr.value;
  }
  visitUnaryExpr(expr: Expr.Unary): f64 {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        return -right;
    }

    // unreachable
    throw new TypeError('compiler error probably');
  }
  visitGroupingExpr(expr: Expr.Grouping): f64 {
    if (true) {
      throw new Error(
        'unimplmented()! handle a GroupingExpr in the NumberInterpreter'
      );
    }
    return 0;
  }
  visitBinaryExpr(expr: Expr.Binary): f64 {
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

      // TODO: how to handle these in the NumberInterpreter?
      case TokenType.GREATER:
      case TokenType.GREATER_EQUAL:
      case TokenType.LESS:
      case TokenType.LESS_EQUAL:
      case TokenType.BANG_EQUAL:
      case TokenType.EQUAL_EQUAL:
      default:
        throw new TypeError('dustan doesn’t know how to computer');

      /*
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
        */
    }
  }
}

export class Interpreter implements Expr.Visitor<Variant> {
  evaluate(expr: Expr.Expr): Variant {
    return expr.accept<Variant>(this);
  }
  private isTruthy(obj: Variant): boolean {
    // TODO: add null support
    // if (obj.is<typeof null>()) return false;
    if (obj.is<boolean>()) return obj.get<boolean>() === true;
    return true;
  }
  private isEqual(a: Variant, b: Variant): boolean {
    // if ((a == null) & (b == null)) return true;
    // if (a == null) return false;
    return a.getUnchecked<string>() == b.getUnchecked<string>();
  }

  visitStringLiteralExpr(expr: Expr.Literal<string>): Variant {
    return Variant.from(expr.value);
  }
  visitBooleanLiteralExpr(expr: Expr.Literal<boolean>): Variant {
    return Variant.from(expr.value);
  }
  visitNumberLiteralExpr(expr: Expr.Literal<f64>): Variant {
    return Variant.from(expr.value);
  }
  visitGroupingExpr(expr: Expr.Grouping): Variant {
    return this.evaluate(expr.expression);
  }
  visitUnaryExpr(expr: Expr.Unary): Variant {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.BANG:
        return Variant.from(!this.isTruthy(right));
      case TokenType.MINUS:
        return Variant.from(-right.get<f64>());
    }

    // unreachable();
    throw new TypeError('compiler error probably');
  }
  visitBinaryExpr(expr: Expr.Binary): Variant {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        return Variant.from(left.get<f64>() - right.get<f64>());
      case TokenType.PLUS:
        if (left.is<f64>()) {
          // TODO: do I need to handle number types and string types differently?
          return Variant.from(left.get<f64>() + right.get<f64>());
        } else {
          return Variant.from(left.get<string>() + right.get<string>());
        }
      case TokenType.SLASH:
        return Variant.from(left.get<f64>() / right.get<f64>());
      case TokenType.STAR:
        return Variant.from(left.get<f64>() * right.get<f64>());

      // TODO: should these all be f64s?
      case TokenType.GREATER:
        return Variant.from(left.get<f64>() > right.get<f64>());
      case TokenType.GREATER_EQUAL:
        return Variant.from(left.get<f64>() >= right.get<f64>());
      case TokenType.LESS:
        return Variant.from(left.get<f64>() < right.get<f64>());
      case TokenType.LESS_EQUAL:
      case TokenType.BANG_EQUAL:
        return Variant.from(!this.isEqual(left, right));
      case TokenType.EQUAL_EQUAL:
        return Variant.from(this.isEqual(left, right));
      default:
        // unreachable();
        throw new TypeError('compiler error probably');
    }
  }
}
