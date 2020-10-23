import { iteratorToList, consG, listFilter, listInspect } from "./cons";
import { Token } from "./basic_tokens";
import { Whitespace } from "./basic_tokens";
import { tokenizer } from "./tokenize";
import { parse as parseAdditive } from "./token_add";

export function parseString(content) {
  // const tokens = iteratorToList(tokenizer(content));

  const meanfulTokens = listFilter(
    consG(tokenizer(content)),
    (token) => !token.typeIs(Whitespace)
  );

  // listInspect(meanfulTokens, console.log);
  return parseAdditive(meanfulTokens);
}
