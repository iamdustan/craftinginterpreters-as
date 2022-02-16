export interface Visitor<R> {
  visitBinaryExpr<R>(expr: Binary): R;
  visitGroupingExpr<R>(expr: Grouping): R;
  visitLiteralExpr<R>(expr: Literal): R;
  visitUnaryExpr<R>(expr: Unary): R;
}

export abstract class Expr {
  abstract accept<R>(visitor: Visitor<R>): R;
}

export class Binary implements Expr {
  this.left: Expr;
  this.operator: Token;
  this.right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: Visitor<R>) {
      return visitor.visitBinaryExpr(this);
  }
}
export class Grouping implements Expr {
  this.expression: Expr;

  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>) {
      return visitor.visitGroupingExpr(this);
  }
}
export class Literal implements Expr {
  this.value: Object;

  constructor(value: Object) {
    this.value = value;
  }

  accept<R>(visitor: Visitor<R>) {
      return visitor.visitLiteralExpr(this);
  }
}
export class Unary implements Expr {
  this.operator: Token;
  this.right: Expr;

  constructor(operator: Token, right: Expr) {
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: Visitor<R>) {
      return visitor.visitUnaryExpr(this);
  }
}

