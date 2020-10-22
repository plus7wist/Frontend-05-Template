import { cons } from "./cons.js";
import * as token from "./basic_tokens.js";

export function parseOperatorMerge(
  lhs,
  source,
  isOperator,
  parse,
  fromOperator
) {
  if (!source) return [new token.Error(), source];
  const operator = source.car;

  if (isOperator(operator)) {
    const [rhs, rest] = parse(source.cdr);
    const mul = fromOperator(lhs, operator, rhs);
    return parse(cons(mul, rest));
  }

  return [lhs, source];
}
