const assert = require("assert").strict;
const { env } = require("process");

// KMP table that allow ? match each point.
function kmpTable(pattern, begin, length) {
  const table = new Array(length).fill(0);
  let i = 1,
    j = 0;

  while (i < length) {
    const pi = pattern[begin + i];
    const pj = pattern[begin + j];
    if (pi == pj || pi == "?" || pj == "?") {
      i += 1;
      j += 1;
      table[i] = j;
    } else if (j > 0) {
      j = table[j];
    } else {
      i += 1;
    }
  }

  return table;
}

function testKmpTable() {
  assert.deepEqual(kmpTable("abcdabce"), [0, 0, 0, 0, 0, 1, 2, 3]);
  assert.deepEqual(kmpTable("abababc"), [0, 0, 0, 1, 2, 3, 4]);
}

function kmp(source, sBegin, sLength, pattern, pBegin, pLength) {
  const table = kmpTable(pattern, pBegin, pLength);
  let i = 0,
    j = 0;
  while (i < sLength) {
    const sChar = source[sBegin + i];
    const pChar = pattern[pBegin + j];

    if (sChar == pChar || pChar == "?") {
      i += 1;
      j += 1;
    } else if (j > 0) {
      j = table[j];
    } else {
      i += 1;
    }

    if (j == pLength) return i - j;
  }
  return -1;
}

function runTest(name, testFn) {
  console.log("Running test", name);
  try {
    testFn();
  } catch (error) {
    console.error(error);
    console.error("Test", name, "failed");
    return;
  }
  console.log("Test", name, "passed");
}

function testKmp() {
  assert.deepEqual(kmp("abc", "abc"), 0);
  assert.deepEqual(kmp("abc", "efg"), -1);
  assert.deepEqual(kmp("ababc", "abc"), 2);
  assert.deepEqual(kmp("aabaabaacx", "aabaac"), 3);

  assert.deepEqual(kmp("abc", "?bc"), 0);
  assert.deepEqual(kmp("abcacc", "?cc"), 3);
}

if (env.MODE == "debug") {
  runTest("kmp table", testKmpTable);
  runTest("kmp", testKmp);
}

function wildcardMatchWithoutStar(source, sBegin, pattern, pBegin, length) {
  for (let i = 0; i < length; i++) {
    const sChar = source[i + sBegin];
    const pChar = pattern[i + pBegin];
    if (sChar != "?" && pChar != "?" && pChar != sChar) return false;
  }
  return true;
}

function wildcardMatch(source, pattern) {
  // console.log("match", source, pattern);

  const stars = [];
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] == "*") {
      stars.push(i);
    }
  }

  if (stars.length == 0) {
    if (source.length != pattern.length) return false;
    return wildcardMatchWithoutStar(source, 0, pattern, 0, pattern.length);
  }

  let sourceBegin = 0;
  if (
    stars[0] != 0 &&
    !wildcardMatchWithoutStar(source, 0, pattern, 0, stars[0])
  ) {
    // console.log("beginning failed");
    return false;
  } else {
    sourceBegin = stars[0];
  }

  for (let i = 1; i < stars.length; i++) {
    const patternBegin = stars[i - 1] + 1;
    const patternLength = stars[i] - stars[i - 1] - 1;
    if (patternLength == 0) {
      continue;
    }
    const matchPoint = kmp(
      source,
      sourceBegin,
      source.length - sourceBegin,
      pattern,
      patternBegin,
      patternLength
    );
    // console.log({ sourceBegin, matchPoint });
    if (matchPoint == -1) {
      // console.log("middle failed");
      return false;
    }
    sourceBegin = matchPoint + patternLength;
  }

  const lastStar = stars[stars.length - 1];
  if (lastStar == source.length - 1) {
    return true;
  }

  {
    const length = pattern.length - lastStar - 1;
    const sourceBegin = source.length - length;
    const patternBegin = pattern.length - length;
    // console.log("final match", { length, sourceBegin, patternBegin });

    return wildcardMatchWithoutStar(
      source,
      sourceBegin,
      pattern,
      patternBegin,
      length
    );
  }
}

function testWildcardMatch() {
  assert.deepEqual(wildcardMatch("abc", "*"), true);
  assert.deepEqual(wildcardMatch("abcd", "a*d"), true);
  assert.deepEqual(wildcardMatch("abcd", "*d"), true);
  assert.deepEqual(wildcardMatch("abcd", "a*"), true);

  assert.deepEqual(wildcardMatch("abcd1234", "a*"), true);
  assert.deepEqual(wildcardMatch("abcd1234", "a*1*"), true);
  assert.deepEqual(wildcardMatch("abcd1234", "*c*4"), true);
  assert.deepEqual(wildcardMatch("abcd1234", "*c*1*"), true);

  assert.deepEqual(wildcardMatch("abcd1234", "a*"), true);
  assert.deepEqual(wildcardMatch("abcd1234", "a*?*"), true);
  assert.deepEqual(wildcardMatch("abcd1234", "*?*4"), true);
  assert.deepEqual(wildcardMatch("abcd1234", "*?*1*"), true);

  assert.deepEqual(wildcardMatch("abcd1234", "*c*b*"), false);
  assert.deepEqual(wildcardMatch("abcd1234", "*c*1*x"), false);
  assert.deepEqual(wildcardMatch("abcd1234", "c*1"), false);
  assert.deepEqual(wildcardMatch("abcd1234", "*c*d"), false);
}

testWildcardMatch();
