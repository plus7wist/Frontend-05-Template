class Token {
  constructor() {}
}

export function tokenClassWithValue(name) {
  return class extends tokenClass(name) {
    constructor(value) {
      super();
      this.value = value;
    }

    toString() {
      return name + ": " + this.value;
    }
  };
}

export function tokenClass(name) {
  return class extends Token {
    constructor() {
      super();
      this.tokenName = name;
    }

    static get tokenName() {
      return name;
    }

    typeIs(type) {
      return name === type.tokenName;
    }

    toString() {
      return name;
    }
  };
}

export const Error = tokenClassWithValue("Error");
export const Number = tokenClassWithValue("Number");
export const Whitespace = tokenClassWithValue("Whitespace");
export const LineTerminator = tokenClassWithValue("LineTerminator");
export const OperatorAdd = tokenClassWithValue("OperatorAdd");
export const OperatorSub = tokenClassWithValue("OperatorSub");
export const OperatorDiv = tokenClassWithValue("OperatorDiv");
export const OperatorMul = tokenClassWithValue("OperatorMul");
export const Eof = tokenClass("Eof");

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
