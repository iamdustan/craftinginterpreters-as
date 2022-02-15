class Expr {
  static class Binary{
    this.left: Expr;
    this.operator: Token;
    this.right: Expr;

    constructor(left: Expr, operator: Token, right: Expr) {
      this.left = left;
      this.operator = operator;
      this.right = right;
    }
  }
  static class Grouping{
    this.expression: Expr;

    constructor(expression: Expr) {
      this.expression = expression;
    }
  }
  static class Literal{
    this.value: Object;

    constructor(value: Object) {
      this.value = value;
    }
  }
  static class Unary{
    this.operator: Token;
    this.right: Expr;

    constructor(operator: Token, right: Expr) {
      this.operator = operator;
      this.right = right;
    }
  }
}

