export class Token {
  constructor() {
    this.name = 'Token';
  }
}

export function metaClass(name) {
  return class extends Token {
    constructor(value) {
      super();
      this.value = value;
      this.name = name;
    }

    static name() { return name; }
  };
}

export function metaClassWithoutValue(name) {
  return class extends Token {
    constructor(value) {
      super();
      this.value = value;
      this.name = name;
    }

    static get name() { return name; }

    isInstanceOf(type) {
      return name === type.name;
    }
  };
}

export const Error = metaClass('Error');
export const Number = metaClass('Number');
export const Whitespace = metaClass('Whitespace');
export const LineTerminator = metaClass('LineTerminator');
export const OperatorAdd = metaClass('OperatorAdd');
export const OperatorSub = metaClass('OperatorSub');
export const OperatorDiv = metaClass('OperatorDiv');
export const OperatorMul = metaClass('OperatorMul');
export const Eof = metaClassWithoutValue('Eof');

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
