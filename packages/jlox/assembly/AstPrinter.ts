import { Expr, Binary, Grouping, Literal, Unary, Visitor } from './Expr';

export class AstPrinter implements Visitor<string> {
  private parenthesize(name: string, exprs: Array<Expr>): string {
    let str = '(' + name;
    for (let i = 0, j = exprs.length; i < j; ++i) {
      str += ' ' + this.print(exprs[i]);
    }
    str += ')';
    return str;
  }
  print(expr: Expr): string {
    return expr.accept<string>(this);
  }
  visitBinaryExpr(expr: Binary): string {
    return this.parenthesize(expr.operator.lexeme, [expr.left, expr.right]);
  }
  visitGroupingExpr(expr: Grouping): string {
    return this.parenthesize('group', [expr.expression]);
  }
  visitStringLiteralExpr(expr: Literal<string>): string {
    return expr.value;
  }
  visitBooleanLiteralExpr(expr: Literal<boolean>): string {
    return expr.value.toString();
  }
  visitNumberLiteralExpr(expr: Literal<f64>): string {
    // slice off the `.0` of “integer” floats
    if (expr.value % 1 == 0) {
      return expr.value.toString().replace('.0', '');
    } else {
      return expr.value.toString();
    }
  }
  visitUnaryExpr(expr: Unary): string {
    return this.parenthesize(expr.operator.lexeme, [expr.right]);
  }
}
