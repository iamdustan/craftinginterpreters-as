import { Expr, Binary, Grouping, Literal, Unary, Visitor } from './Expr';

export class AstRpnPrinter implements Visitor<string> {
  private parenthesize(_name: string, exprs: Array<Expr>): string {
    let str = '';
    for (let i = 0, j = exprs.length; i < j; ++i) {
      str += this.print(exprs[i]);
    }
    str += '';
    return str;
  }
  print(expr: Expr): string {
    return expr.accept<string>(this);
  }
  visitBinaryExpr(expr: Binary): string {
    return (
      this.print(expr.left) +
      ' ' +
      this.print(expr.right) +
      ' ' +
      expr.operator.lexeme
    );
  }
  visitGroupingExpr(expr: Grouping): string {
    return this.parenthesize('group', [expr.expression]);
  }
  visitStringLiteralExpr(expr: Literal<string>): string {
    return expr.value;
  }
  visitNumberLiteralExpr(expr: Literal<f64>): string {
    // this is a very naive and 
    if (expr.value % 1 == 0) {
      return expr.value.toString().replace('.0', '');
    } else {
      return expr.value.toString();
    }
  }
  visitBooleanLiteralExpr(expr: Literal<boolean>): string {
    return expr.value.toString();
  }
  visitUnaryExpr(expr: Unary): string {
    return this.parenthesize(expr.operator.lexeme, [expr.right]);
  }
}
