const inspectStep = "  ";

class Token {
  constructor() {}

  describe() {
    return this;
  }

  inspect(prefix) {
    console.log(prefix, this);
  }

  inspectTop() {
    this.inspect("|");
  }
}

class TokenError extends Token {}

class TokenNumber extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

class TokenWhitespace extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

class TokenLineTerminator extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

class TokenOperatorAdd extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

class TokenOperatorSub extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

class TokenOperatorMul extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

class TokenOperatorDiv extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

class TokenEof extends Token {
  constructor() {
    super();
  }
}

const tokenRegex = /([0-9.]+)|([\t ]+)|([\r\n]+)|(\+)|(\-)|(\*)|(\/)/g;

const tokenTypeList = [
  TokenNumber,
  TokenWhitespace,
  TokenLineTerminator,
  TokenOperatorAdd,
  TokenOperatorSub,
  TokenOperatorMul,
  TokenOperatorDiv,
];

function* tokenizer(source) {
  while (true) {
    const lastIndex = tokenRegex.lastIndex;
    const result = tokenRegex.exec(source);

    if (!result) break;

    if (tokenRegex.lastIndex - lastIndex > result[0].length) {
      yield new TokenError();
      break;
    }

    for (let i = 0; i < tokenTypeList.length; i++) {
      const capture = result[i + 1];
      if (capture) yield new tokenTypeList[i](capture);
    }
  }
  yield new TokenEof();
}

class TokenMultiplicative extends Token {
  constructor(operator, children) {
    super();
    this.operator = operator;
    this.children = children;
  }

  static fromNumber(number) {
    return new TokenMultiplicative(null, [number]);
  }

  static fromOperator(lhs, operator, rhs) {
    return new TokenMultiplicative(operator, [lhs, rhs]);
  }

  describe() {
    if (this.operator === null) {
      return this.children[0].describe();
    }
    return this;
  }

  inspect(prefix) {
    console.log(prefix, "TokenMultiplicative");
    if (this.operator === null) {
      this.children[0].inspect(prefix + inspectStep);
    } else {
      this.operator.inspect(prefix + inspectStep);

      const step2 = inspectStep + inspectStep;
      this.children[0].inspect(prefix + step2);
      this.children[1].inspect(prefix + step2);
    }
  }
}

class Cons {
  constructor(car, cdr) {
    this.car = car;
    this.cdr = cdr;
  }
}

function cons(car, cdr) {
  return new Cons(car, cdr);
}

// return [ast, restSource]
function parseMultiplicativeExperssion(source) {
  if (source === null) return [null, source];

  const first = source.car;
  if (first instanceof TokenNumber) {
    const multi = TokenMultiplicative.fromNumber(first);
    return parseMultiplicativeExperssion(cons(multi, source.cdr));
  }

  const lhs = source.car;
  const operator = source.cdr?.car;

  if (first instanceof TokenMultiplicative) {
    const merge = () => {
      if (operator instanceof TokenOperatorMul) return true;
      if (operator instanceof TokenOperatorDiv) return true;
      return false;
    };

    if (merge()) {
      const [rhs, rest] = parseMultiplicativeExperssion(source.cdr.cdr);
      const mul = TokenMultiplicative.fromOperator(lhs, operator, rhs);
      return parseMultiplicativeExperssion(cons(mul, rest));
    }

    return [first, source.cdr];
  }

  return [new TokenError(), source];
}

function iteratorToList(iterator) {
  let { value, done } = iterator.next();
  if (done) return null;
  return cons(value, iteratorToList(iterator));
}

function arrayToListRange(array, begin, end) {
  if (end - begin == 0) return null;
  return cons(array[begin], arrayToListRange(array, begin + 1, end));
}

function arrayToList(array) {
  return arrayToListRange(array, 0, array.length);
}

function listMap(list, fn) {
  if (list === null) return null;
  return cons(fn(list.car), listMap(list.cdr, fn));
}

function listInspect(list, fn) {
  if (list === null) return null;
  fn(list.car);
  listInspect(list.cdr, fn);
}

function listFilter(list, fn) {
  if (list === null) return null;
  if (fn(list.car)) return cons(list.car, listFilter(list.cdr, fn));
  return listFilter(list.cdr, fn);
}

function main() {
  const tokens = iteratorToList(tokenizer("10 / 23 * 3"));

  const meanfulTokens = listFilter(
    tokens,
    (token) => !(token instanceof TokenWhitespace)
  );

  const [ast, restSource] = parseMultiplicativeExperssion(meanfulTokens);

  ast.inspectTop();

  console.log("Rest:");
  listInspect(restSource, (token) => token.inspectTop());
}

main();
