import { cons } from "./cons";
import * as token from "./basic_tokens";

export class Multiplicative extends token.tokenClass("Multiplicative") {
  constructor(operator, children) {
    super();
    this.operator = operator;
    this.children = children;
  }

  static wrap(number) {
    return new Multiplicative(null, [number]);
  }

  static fromOperator(lhs, operator, rhs) {
    return new Multiplicative(operator, [lhs, rhs]);
  }
}

// Multiplicative =
//  Number |
//  Multiplicative * Number |
//  Multiplicative / Number
export function parse(source) {
  if (source === null) return [new token.Error("empty source"), source];
  if (source.cdr === null) return [source.car, null];

  const first = source.car;
  if (first.typeIs(token.Number)) {
    const mul = Multiplicative.wrap(first);
    return parse(cons(mul, source.cdr));
  }

  if (first.typeIs(Multiplicative)) {
    const lhs = first;
    const operator = source.cdr.car;

    if (
      !operator.typeIs(token.OperatorMul) &&
      !operator.typeIs(token.OperatorDiv)
    ) {
      return [lhs, source.cdr];
    }

    const [rhs, rest] = parse(source.cdr.cdr);
    const mul = Multiplicative.fromOperator(lhs, operator, rhs);
    return parse(cons(mul, rest));
  }

  return [new token.Error(first.toString()), source];
}
