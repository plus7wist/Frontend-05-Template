import { cons, iteratorToList, listFilter, listInspect } from "./cons.js";
import * as token from "./basic_tokens.js";

export function tokenizer(source) {
  const next  = () => {
    const lastIndex = token.tokenRegex.lastIndex;
    const result = token.tokenRegex.exec(source);

    if (!result) return iteratorEnd();

    if (token.tokenRegex.lastIndex - lastIndex > result[0].length) {
      return iteratorYield(new token.Error());
    }

    for (let i = 0; i < token.tokenTypeList.length; i++) {
      const capture = result[i + 1];
      if (capture) {
        const TokenClass = token.tokenTypeList[i];
        return iteratorYield(new TokenClass(capture));
      }
    }

    return iteratorEnd();
  };

  return { next: next };
}

function iteratorYield(value) {
  return {value: value, done: false}
}

function iteratorEnd() { return {done: true}; }
