import { Variant } from 'as-variant/assembly';
import { TokenType } from './Scanner';
import * as Expr from './Expr';
import * as Stmt from './Stmt';
import  { Lox } from './Scanner';

export class Interpreter implements Expr.Visitor<Variant>, Stmt.Visitor<void> {
  interpret(statements: Array<Stmt.Stmt>): void {
    // try {
    for (let i = 0; i < statements.length; i++) {
      this.execute(statements[i]);
    }
    // } catch (error) {
    //   Lox.runtimeError(error);
    // }
  }


  evaluate(expr: Expr.Expr): Variant {
    return expr.accept<Variant>(this);
  }
  execute(stmt: Stmt.Stmt): void {
    stmt.accept<void>(this);
  }


  private isTruthy(obj: Variant): boolean {
    // TODO: add null support
    // if (obj.is<typeof null>()) return false;
    if (obj.is<boolean>()) return obj.get<boolean>() === true;
    return true;
  }
  private isEqual<T>(a: Variant, b: Variant): boolean {
    // if ((a == null) & (b == null)) return true;
    // if (a == null) return false;
    return a.getUnchecked<T>() == b.getUnchecked<T>();
  }

  visitLiteralExpr(expr: Expr.Literal): Variant {
    return expr.value;
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
          return Variant.from(left.get<f64>() + right.get<f64>());
        } else if (left.is<f32>()) {
          return Variant.from(left.get<f32>() + right.get<f32>());
        } else if (left.is<i64>()) {
          return Variant.from(left.get<i64>() + right.get<i64>());
        } else if (left.is<i32>()) {
          return Variant.from(left.get<i32>() + right.get<i32>());
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
        return Variant.from(!this.isEqual<f64>(left, right));
      case TokenType.EQUAL_EQUAL:
        if (left.is<f64>()) {
          return Variant.from(this.isEqual<f64>(left, right));
        } else {
          return Variant.from(this.isEqual<string>(left, right));
        }
      default:
        // unreachable();
        throw new TypeError('compiler error probably');
    }
  }


  // Stmt.Visitor
  visitExpressionStmt(stmt: Stmt.Expression ): void {
    this.evaluate(stmt.expression);
  }
  visitPrintStmt(stmt: Stmt.Print ): void {
    const value = this.evaluate(stmt.expression);
    if (value.is<f64>()) {
      console.log(value.get<f64>().toString());
    } else if (value.is<f32>()) {
      console.log(value.get<f32>().toString());
    } else if (value.is<i64>()) {
      console.log(value.get<i64>().toString());
    } else if (value.is<i32>()) {
      console.log(value.get<i32>().toString());
    } else if (value.is<boolean>()) {
      console.log(value.get<boolean>().toString());
    } else {
    // } else if (value.is<f64>()) {
    // } else if (value.is<f64>()) {
      // TODO: unbox this
      console.log(value.getUnchecked<string>());
    }
  }
  
}
