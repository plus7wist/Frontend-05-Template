import { strict as assert } from "assert";
import { env } from "process";

function kmpTable(pattern) {
  const table = new Array(pattern.length).fill(0);
  let i = 1,
    j = 0;

  while (i < pattern.length) {
    if (pattern[i] == pattern[j]) {
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

function kmp(source, pattern) {
  const table = kmpTable(pattern);
  let i = 0, j = 0;
  while (i < source.length) {
    if (source[i] === pattern[j]) {
      i += 1;
      j += 1;
    } else if (j > 0) {
      j = table[j];
    } else {
      i += 1;
    }
    if (j == pattern.length) {
      return i - j;
    }
  }
  return -1;
}

function runTest(name, testFn) {
  console.log('Running test', name);
  try {
    testFn();
  } catch (error) {
    console.error(error);
    console.error('Test', name, 'failed');
    return;
  }
  console.log('Test', name, 'passed');
}

function testKmp() {
  assert.deepEqual(kmp("abc", "abc"), 0);
  assert.deepEqual(kmp("abc", "efg"), -1);
  assert.deepEqual(kmp("ababc", "abc"), 2);
  assert.deepEqual(kmp("aabaabaacx", "aabaac"), 3);
}

if (env.MODE == 'debug') {
  runTest('kmp table', testKmpTable);
  runTest('kmp', testKmp);
}
