import { cons } from "./cons.js";
import * as token from "./basic_tokens.js";
import { parseOperatorMerge } from "./token_operator.js";

export class Multiplicative extends token.metaClassWithoutValue('Multiplicative') {
  constructor(operator, children) {
    super();
    this.operator = operator;
    this.children = children;
    this.name = 'Multiplicative'
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
  if (source === null) return [null, source];

  const first = source.car;
  if (first instanceof token.Number) {
    const multi = Multiplicative.wrap(first);
    return parse(cons(multi, source.cdr));
  }

  if (first instanceof Multiplicative) {
    return parseOperatorMerge(
      first,
      source.cdr,
      (operator) =>
        operator instanceof token.OperatorMul ||
        operator instanceof token.OperatorDiv,
      parse,
      Multiplicative.fromOperator
    );
  }

  return [new token.Error(), source];
}
