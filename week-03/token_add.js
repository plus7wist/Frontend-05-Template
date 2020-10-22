import { cons } from "./cons.js";
import * as token from "./basic_tokens.js";
import { Multiplicative, parse as parseMultiplicative } from "./token_mul.js";
import { parseOperatorMerge } from "./token_operator.js";

export class Additive extends token.Token {
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
//   Additive + Number |
//   Additive - Number
export function parse(source) {
  if (source === null) return [null, source];

  const [mul, rest] = parseMultiplicative(source);
  if (mul instanceof Multiplicative) {
    const add = Additive.wrap(mul);
    return parse(cons(add, rest));
  }

  const first = source.car;
  if (first instanceof Additive) {
    return parseOperatorMerge(
      first,
      source.cdr,
      (operator) =>
        operator instanceof token.OperatorAdd ||
        operator instanceof token.OperatorSub,
      parse,
      Additive.fromOperator
    );
  }

  return [new token.Error(), source];
}
