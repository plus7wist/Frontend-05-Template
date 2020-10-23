import { cons } from "./cons";
import * as token from "./basic_tokens";
import { Multiplicative, parse as parseMultiplicative } from "./token_mul";

export class Additive extends token.tokenClass("Additive") {
  constructor(operator, children) {
    super();
    this.operator = operator;
    this.children = children;
  }

  static wrap(number) {
    return new Additive(null, [number]);
  }

  static fromOperator(lhs, operator, rhs) {
    return new Additive(operator, [lhs, rhs]);
  }
}

function isAdditiveOperator(operator) {
  return (
    operator.typeIs(token.OperatorAdd) || operator.typeIs(token.OperatorSub)
  );
}

// Additive =
//   Multiplicative |
//   Additive + Multiplicative |
//   Additive - Multiplicative
export function parse(source) {
  if (source === null) return [null, source];
  if (source.cdr === null) return [source.car, null];

  const [mul, rest] = parseMultiplicative(source);
  if (mul.typeIs(Multiplicative)) {
    const add = Additive.wrap(mul);
    return parse(cons(add, rest));
  }

  const lhs = source.car;
  if (lhs.typeIs(Additive)) {
    const operator = source.cdr.car;

    if (!isAdditiveOperator(operator)) {
      return [lhs, source];
    }

    const [rhs, rest] = parseMultiplicative(source.cdr.cdr);
    const mul = Additive.fromOperator(lhs, operator, rhs);
    return parse(cons(mul, rest));
  }

  return [new token.Error(lhs.toString()), source];
}
