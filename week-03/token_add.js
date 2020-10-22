import { cons } from "./cons.js";
import * as token from "./basic_tokens.js";
import { Multiplicative, parse as parseMultiplicative } from "./token_mul.js";
import { parseOperatorMerge } from "./token_operator.js";

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

// Additive =
//   Multiplicative |
//   Additive + Multiplicative |
//   Additive - Multiplicative
export function parse(source) {
  if (source === null) return [null, source];
  if (source.cdr === null) return [source.car, null];

  const [mul, rest] = parseMultiplicative(source);
  if (mul.isInstanceOf(Multiplicative)) {
    const add = Additive.wrap(mul);
    return parse(cons(add, rest));
  }

  const lhs = source.car;
  if (lhs.isInstanceOf(Additive)) {
    const operator = source.cdr.car;

    if (
      !operator.isInstanceOf(token.OperatorAdd) &&
      !operator.isInstanceOf(token.OperatorSub)
    ) {
      return [lhs, source];
    }

    const [rhs, rest] = parseMultiplicative(source.cdr.cdr);
    const mul = Additive.fromOperator(lhs, operator, rhs);
    return parse(cons(mul, rest));
  }

  return [new token.Error(lhs.toString()), source];
}
