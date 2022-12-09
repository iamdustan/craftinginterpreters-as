import { Expr } from './Expr';

export interface Visitor<R> {
  visitExpressionStmt(stmt: Expression): R;
  visitPrintStmt(stmt: Print): R;
}

export abstract class Stmt {
  abstract accept<R>(visitor: Visitor<R>): R;
  abstract getExpression(): Expr;
}

export class Expression extends Stmt {
  expression: Expr;
  getExpression(): Expr {
    return this.expression;
  }

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }
}
export class Print extends Stmt {
  expression: Expr;

  getExpression(): Expr {
    return this.expression;
  }

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitPrintStmt(this);
  }
}

