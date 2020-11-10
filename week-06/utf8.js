function utf8ByteCountOfCharCode(charCode) {
  if (charCode < 128) {
    return 1;
  } else if (charCode < 2048) {
    return 2;
  } else if (charCode < 65536) {
    return 3;
  } else if (charCode < 2097152) {
    return 4;
  }
  throw new Error(`character ${charCode} too large`);
}

function* utf8OfCharCode(charCode) {
  let count = utf8ByteCountOfCharCode(charCode);

  if (count == 1) {
    yield charCode;
    return;
  }

  const lhs = parseInt("1111".slice(0, count), 2) << (8 - count);
  const rhs = charCode >>> (--count * 6);
  yield lhs + rhs;

  for (; count > 0; ) {
    const _ = charCode >>> (--count * 6);
    yield (_ & 0x3f) | 0x80;
  }
}

function* utf8OfString(string) {
  for (let i = 0; i < string.length; i++) {
    for (const each of utf8OfCharCode(string.charCodeAt(i))) {
      yield each;
    }
  }
}

function utf8OfStringAsArray(string) {
  let array = [];
  for (const each of utf8OfString(string)) {
    array.push(each);
  }
  return array;
}

function checkText(text) {
  const answer = JSON.stringify(Buffer.from(text).toJSON().data);
  const result = JSON.stringify(utf8OfStringAsArray(text));

  if (result != answer) {
    console.log(text, "->", result, "answer is", answer);
  } else {
    console.log(text, "->", result);
  }
}

checkText("兔子79岁了");
