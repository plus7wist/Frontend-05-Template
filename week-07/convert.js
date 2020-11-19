function stringToNumber(string) {
  if (string.startsWith("0x") || string.startsWith("0X")) {
    return parseInt(string.substring(2), 16);
  }
  if (string.startsWith("0b")) {
    return parseInt(string.substring(2), 2);
  }
  if (string.startsWith("0")) {
    return parseInt(string.substring(1), 8);
  }
  return parseInt(string, 10);
}

function numberToString(number, base=10) {
  number = number.toString(base);
  if (base === 10) return number;
  if (base === 2) return `0b${number}`;
  if (base === 8) return `0${number}`;
  if (base === 16) return `0x${number}`;
  return null;
}

const assert = require('assert');

assert.deepEqual(numberToString(stringToNumber('0x9a'), 16), '0x9a');
assert.deepEqual(numberToString(stringToNumber('072'), 8), '072');
assert.deepEqual(numberToString(stringToNumber('0b11'), 2), '0b11');
assert.deepEqual(numberToString(stringToNumber('9014'), 10), '9014');
