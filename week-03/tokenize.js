import { cons, iteratorToList, listFilter, listInspect } from "./cons.js";
import * as token from "./basic_tokens.js";

class IteratorEnding {}
const iteratorEnding = new IteratorEnding();

export function tokenizer(source) {
  const next = () => {
    const lastIndex = token.tokenRegex.lastIndex;
    const result = token.tokenRegex.exec(source);

    if (!result) return iteratorEnding;

    if (token.tokenRegex.lastIndex - lastIndex > result[0].length) {
      return new token.Error();
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
    if (value instanceof IteratorEnding) {
      return { done: true };
    }
    return { done: false, value: value };
  };

  return { next: iteratorNext };
}

function iteratorEnd() {
  return { done: true };
}
