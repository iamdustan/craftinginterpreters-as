interface Visitor<T> {
  accept(visitor: Expr): T;
}

class AstPrinter implements Expr.Visitor<string> {
  print(expr: Expr): string {
    return expr.accept(this);
  }
  visitBinaryExpr(expr: Expr.Binary): string {
    return parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }
  visitGroupingExpr(expr: Expr.Grouping): string {
    return parenthesize('group', expr.expression);
  }
  visitLiteralExpr(expr: Expr.Literal): string {
    if (expr.value == null) return 'nil';
    return expr.valuie.toString();
  }
  visitUnaryExpr(expr: Expr.Unary): string {
    return parenthesize(expr.operator.lexeme, expr.right);
  }
}
