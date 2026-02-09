import { getDataFromMode } from '../src/ui-controls.js';

function mockDOM(mode, values) {
  global.document = {
    querySelector: (selector) => {
      if (selector === '.mode-tabs [role="tab"][aria-selected="true"]') {
        return { dataset: { mode: mode } };
      }
      return null;
    },
    getElementById: (id) => {
      return { value: (values[id] !== undefined ? values[id] : '') };
    }
  };
}

function runTest(name, mode, values, expectedSubstring) {
  console.log(`Running test: ${name}`);
  mockDOM(mode, values);
  const result = getDataFromMode();
  if (result.includes(expectedSubstring)) {
    console.log(`  PASSED: found "${expectedSubstring}"`);
  } else {
    console.log(`  FAILED: expected substring "${expectedSubstring}" not found in:`);
    console.log(result);
    process.exit(1);
  }
}

function runNegativeTest(name, mode, values, unexpectedSubstring) {
  console.log(`Running negative test: ${name}`);
  mockDOM(mode, values);
  const result = getDataFromMode();
  if (!result.includes(unexpectedSubstring)) {
    console.log(`  PASSED: "${unexpectedSubstring}" not found (as expected)`);
  } else {
    console.log(`  FAILED: found unexpected substring "${unexpectedSubstring}" in:`);
    console.log(result);
    process.exit(1);
  }
}

// 1. Newline injection
runNegativeTest('Newline injection in name', 'vcard', {
  'data-vcard-name': 'John Doe\nORG:Hacker Corp'
}, '\nORG:Hacker Corp');

runTest('Escaped newline in name', 'vcard', {
  'data-vcard-name': 'John Doe\nORG:Hacker Corp'
}, 'FN:John Doe\\nORG:Hacker Corp');

// 2. Semicolons
runTest('Semicolons in name', 'vcard', {
  'data-vcard-name': 'Doe;John'
}, 'FN:Doe\\;John');
runTest('Semicolons in name (N field)', 'vcard', {
  'data-vcard-name': 'Doe;John'
}, 'N:Doe\\;John;;;');

// 3. Commas
runTest('Commas in name', 'vcard', {
  'data-vcard-name': 'Doe, John'
}, 'FN:Doe\\, John');

// 4. Backslashes
runTest('Backslashes in name', 'vcard', {
  'data-vcard-name': 'John \\ Doe'
}, 'FN:John \\\\ Doe');

// 5. TEL field with special chars (though we strip spaces)
runTest('TEL field with newline', 'vcard', {
  'data-vcard-tel': '123\n456'
}, 'TEL:123456');

// 6. EMAIL field with injection
runNegativeTest('EMAIL injection', 'vcard', {
  'data-vcard-email': 'test@example.com\nADR:Fake St'
}, '\nADR:Fake St');
runTest('EMAIL escaped', 'vcard', {
  'data-vcard-email': 'test@example.com\nADR:Fake St'
}, 'EMAIL:test@example.com\\nADR:Fake St');

console.log('\nAll fix verification tests passed!');
