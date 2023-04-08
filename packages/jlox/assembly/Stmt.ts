import { Expr } from './Expr';
import { Token } from './Scanner';

export interface Visitor<R> {
  visitExpressionStmt(stmt: Expression): R;
  visitPrintStmt(stmt: Print): R;
  visitVarStmt(stmt: Var): R;
}

export abstract class Stmt {
  abstract accept<R>(visitor: Visitor<R>): R;
  abstract getExpression(): Expr;

}

export class Expression extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }

  getExpression() {
    return this.expression;
  }
}
export class Print extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitPrintStmt(this);
  }
getExpression() {
    return this.expression;
  }
}
export class Var extends Stmt {
  name: Token;
  initializer: Expr;

  constructor(name: Token, initializer: Expr) {
    super();
    this.name = name;
    this.initializer = initializer;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVarStmt(this);
  }

  getExpression() {
    return this.initializer;
  }
}

