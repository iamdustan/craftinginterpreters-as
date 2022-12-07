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
  visitLiteralExpr(expr: Literal): string {
    const v = expr.value;
    if (v.is<string>()) {
      return v.get<string>();
    } else if (v.is<boolean>()) {
      return v.get<boolean>().toString();
    } else if (
      v.is<f64>() ||
      v.is<f32>()
    ) {
      let num = v.getUnchecked<f64>();
      // slice off the `.0` of “integer” floats
      if (num % 1 == 0) {
        return num.toString().replace('.0', '');
      } else {
        return num.toString();
      }
    } else if (
      v.is<i64>() ||
      v.is<i32>()
    ) {
      let num = v.get<i32>();
      return num.toString();
    }
    throw new TypeError('unexpected Literal type ' + v.id.toString());
    // unreachable();
  }
  visitUnaryExpr(expr: Unary): string {
    return this.parenthesize(expr.operator.lexeme, [expr.right]);
  }
}
