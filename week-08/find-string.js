// Find "abcd" in string `string`.
function findAbcd(string) {
  let foundA = false;
  let foundB = false;
  let foundC = false;

  for (const each of string) {
    if (each == "a") {
      foundA = true;
    } else if (foundA && each == "b") {
      foundB = true;
    } else if (foundB && each == "c") {
      foundC = true;
    } else if (foundC && each == "d") {
      return true;
    } else {
      foundA = false;
      foundB = false;
      foundC = false;
    }
  }
  return false;
}

// Find "abcd" in string `string`, version 2.
function findAbcdV2(string) {
  let substring = "abcd";
  let topFound = 0;

  for (const each of string) {
    if (each !== substring[topFound]) {
      topFound = 0;
      continue;
    }

    topFound += 1;

    if (topFound == substring.length) {
      return true;
    }
  }
  return false;
}
//console.log(findAbcd("i abcdm groot"));
//console.log(findAbcdV2("i abcdm groot"));

function findAbcdSm(string) {
  const start = (c) => (c === "a" ? foundA : start);
  const foundA = (c) => (c === "b" ? foundB : start(c));
  const foundB = (c) => (c === "c" ? foundC : start(c));
  const foundC = (c) => (c === "d" ? end : start(c));

  return stateMatch(string, start);
}
//console.log(findAbcdSm("ababcd"));

function stateMatch(string, start) {
  let current = start;
  for (const each of string) {
    current = current(each);
  }
  return current === stateEnd;
}

function stateEnd(c) {
  return stateEnd;
}

// find 'abcabx'
function findAbcabx(string) {
  const st = (c) => (c === "a" ? a1 : st);
  const a1 = (c) => (c === "b" ? b1 : st(c));
  const b1 = (c) => (c === "c" ? c1 : st(c));
  const c1 = (c) => (c === "a" ? a2 : st);
  const a2 = (c) => (c === "b" ? b2 : st(c));
  const b2 = (c) => (c === "x" ? stateEnd : b1(c));
  return stateMatch(string, st);
}
//console.log(findAbcabx("abcabx"));
//console.log(findAbcabx("ababcabx"));
//console.log(findAbcabx("abcabcabx"));

// find 'abababx'
function findAbababx(string) {
  const st = (c) => (c === "a" ? a1 : st);
  const a1 = (c) => (c === "b" ? b1 : st(c));
  const b1 = (c) => (c === "a" ? a2 : st); // [^a] can't be start
  const a2 = (c) => (c === "b" ? b2 : st(c));
  const b2 = (c) => (c === "a" ? a3 : st); // [^a] can't be start
  const a3 = (c) => (c === "b" ? b3 : st(c));
  const b3 = (c) => (c === "x" ? stateEnd : b2(c)); // ababab[^x] might be ..ababa
  return stateMatch(string, st);
}
//console.log(findAbababx("abababx"));
//console.log(findAbababx("ababababx"));

function find(string, substr) {
  if (substr.length == 0) return true;

  const next = kmpNext(substr);

  // start state must not re-consume input
  const st = (c) => (c === substr[0] ? states[1] : st);
  const states = [st];

  for (let i = 1; i < substr.length; i++) {
    states.push((c) =>
      c === substr[i] ? states[i + 1] : states[next[i - 1]](c)
    );
  }

  states.push(stateEnd);

  return stateMatch(string, st);
}
//console.log(find("abcabx", "abcabx"));
//console.log(find("ababcabx", "abcabx"));
//console.log(find("abababx", "abababx"));
//console.log(find("ababababx", "abababx"));

function kmpNext(text) {
  const next = new Array(text.length).fill(0);
  for (let i = 1; i < text.length; i++) {
    let j = next[i - 1];
    while (j > 0 && text[i] !== text[j]) j = next[j - 1];
    if (text[i] === text[j]) j += 1;
    next[i] = j;
  }
  return next;
}

//console.log(kmpNext("abcabx")); // [0 0 0 1 2 0]
