import { cons, iteratorToList, listFilter, listInspect } from "./cons";
import * as token from "./basic_tokens";

class IteratorEnding {}
const iteratorEnding = new IteratorEnding();

export function tokenizer(source) {
  const next = () => {
    const lastIndex = token.tokenRegex.lastIndex;
    const result = token.tokenRegex.exec(source);

    if (!result) return iteratorEnding;

    if (token.tokenRegex.lastIndex - lastIndex > result[0].length) {
      return new token.Error(result);
    }

    for (let i = 0; i < token.tokenTypeList.length; i++) {
      const capture = result[i + 1];
      if (capture) {
        const TokenClass = token.tokenTypeList[i];
        return new TokenClass(capture);
      }
    }

    return iteratorEnding;
  };

  const iteratorNext = () => {
    const value = next();
    if (value === iteratorEnding) {
      return { done: true };
    }
    return { done: false, value: value };
  };

  return { next: iteratorNext };
}
