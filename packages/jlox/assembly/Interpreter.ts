import { Variant } from 'as-variant/assembly';
import { TokenType } from './Scanner';
import * as Expr from './Expr';

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
