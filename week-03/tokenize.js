import { cons, iteratorToList, listFilter, listInspect } from "./cons.js";
import * as token from "./basic_tokens.js";

export function* tokenizer(source) {
  while (true) {
    const lastIndex = token.tokenRegex.lastIndex;
    const result = token.tokenRegex.exec(source);

    if (!result) break;

    if (token.tokenRegex.lastIndex - lastIndex > result[0].length) {
      yield new token.Error();
      break;
    }

    for (let i = 0; i < token.tokenTypeList.length; i++) {
      const capture = result[i + 1];
      if (capture) yield new token.tokenTypeList[i](capture);
    }
  }
  yield new token.Eof();
}
