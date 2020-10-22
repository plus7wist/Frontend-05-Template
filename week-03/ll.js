import { iteratorToList, listFilter, listInspect } from "./cons";
import { Whitespace } from "./basic_tokens";
import { tokenizer } from "./tokenize";
import { parse as parseAdditive } from "./token_add";

export function parseString(string) {
  const tokens = iteratorToList(tokenizer(string));

  const meanfulTokens = listFilter(
    tokens,
    (token) => !token.isInstanceOf(Whitespace)
  );

  // listInspect(meanfulTokens, console.log);
  return parseAdditive(meanfulTokens);
}
