import { Token } from './Scanner';

export interface Visitor<R> {
  visitBinaryExpr(expr: Binary): R;
  visitGroupingExpr(expr: Grouping): R;
  visitStringLiteralExpr(expr: Literal<string>): R;
  visitBooleanLiteralExpr(expr: Literal<boolean>): R;
  visitNumberLiteralExpr(expr: Literal<f64>): R;
  visitUnaryExpr(expr: Unary): R;
}

export abstract class Expr {
  abstract accept<R>(visitor: Visitor<R>): R;
}
export class Binary extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitBinaryExpr(this);
  }
}
export class Grouping extends Expr {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitGroupingExpr(this);
  }
}
export class Literal<T> extends Expr {
  value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }

  accept<R>(visitor: Visitor<R>): R {
    if (nameof(this.value) === 'string') {
      return visitor.visitStringLiteralExpr(changetype<Literal<string>>(this));
    } else if (nameof(this.value) === 'boolean') {
      return visitor.visitBooleanLiteralExpr(changetype<Literal<boolean>>(this));
    } else if (nameof(this.value) === 'f64') {
      return visitor.visitNumberLiteralExpr(changetype<Literal<f64>>(this));
    } else {
      throw new TypeError(`Unexpected Literal type of ${nameof(this.value)} found`);
    }
  }
}
export class Unary extends Expr {
  operator: Token;
  right: Expr;

  constructor(operator: Token, right: Expr) {
    super();
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitUnaryExpr(this);
  }
}
