import { iteratorToList, listFilter, listInspect } from "./cons.js";
import { Whitespace } from "./basic_tokens.js";
import { tokenizer } from "./tokenize.js";

//import { Multiplicative } from "./token_mul.js";

import { parse as parseAdditive } from "./token_add.js";

export function parseString(string) {
  const tokens = iteratorToList(tokenizer(string));
  const meanfulTokens = listFilter(
    tokens,
    (token) => !(token instanceof Whitespace)
  );

  return parseAdditive(meanfulTokens);
}
