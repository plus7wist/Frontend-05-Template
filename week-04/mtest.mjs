class TestCase {
  constructor(name, testFn) {
    this.name = name;
    this.testFn = testFn;
  }
}

export function testCase(name, testFn) {
  return new TestCase(name, testFn);
}

export function runTest(name, module) {
  for (const name in module) {
    const testCase = module[name];
    if (testCase instanceof TestCase && testCase.name === name) {
      console.log('Running test', name);
      testCase.testFn();
      console.log('Test', name, 'passed');
      return;
    }
  }
  console.error('Invalid test name', name);
}

export function runAllTest(module) {
  for (const name in module) {
    const testCase = module[name];
    if (testCase instanceof TestCase) {
      console.log('Running test', name);
      testCase.testFn();
      console.log('Test', name, 'passed');
    }
  }
}
