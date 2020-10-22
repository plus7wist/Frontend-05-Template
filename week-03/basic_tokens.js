export class Token {
  constructor() {}
}

export class Error extends Token {}

export class Number extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class Whitespace extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class LineTerminator extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class OperatorAdd extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class OperatorSub extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class OperatorMul extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class OperatorDiv extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class Eof extends Token {
  constructor() {
    super();
  }
}

export const tokenRegex = /([0-9.]+)|([\t ]+)|([\r\n]+)|(\+)|(\-)|(\*)|(\/)/g;

export const tokenTypeList = [
  Number,
  Whitespace,
  LineTerminator,
  OperatorAdd,
  OperatorSub,
  OperatorMul,
  OperatorDiv,
];
