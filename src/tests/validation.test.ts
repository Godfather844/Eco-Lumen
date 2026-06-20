import { validateEmail, sanitizeInput, safeParsePositiveNumber, validateName } from '../utils/validation';

/**
 * Self-contained unit tests for form verification and input safety guards.
 */

export function runValidationTestSuite() {
  console.log('--- STARTING VALIDATION TEST SUITE ---');

  // Test Case 1: Email Form structures
  if (validateEmail('test@ecomail.com') && !validateEmail('invalid-email-address') && !validateEmail('abc@xyz')) {
    console.log('✓ Test Case 1: Form email structure validation matches correctly.');
  } else {
    console.error('✗ Test Case 1 Failed: Email structures verification mismatch.');
  }

  // Test Case 2: String characters sanitization
  const parsedXss = sanitizeInput('<script>alert(1);</script>Liam');
  if (parsedXss === 'alert(1);Liam') {
    console.log('✓ Test Case 2: Strip HTML tags and dangerous characters matches correctly.');
  } else {
    console.error('✗ Test Case 2 Failed: Output from sanitizer is insecure:', parsedXss);
  }

  // Test Case 3: Positive numbers safety bound checks
  const negativeParse = safeParsePositiveNumber('-50', 0, 1000);
  const nanParse = safeParsePositiveNumber('abc', 10, 500);
  if (negativeParse === 0 && nanParse === 10) {
    console.log('✓ Test Case 3: Negative and unparseable values resolve safely to fallback thresholds.');
  } else {
    console.error('✗ Test Case 3 Failed: Boundary guards bypass found.', { negativeParse, nanParse });
  }

  // Test Case 4: Name input length constraints
  const emptyName = validateName('   ');
  const shortName = validateName('A');
  const validName = validateName('Elizabeth');
  if (!emptyName.isValid && !shortName.isValid && validName.isValid) {
    console.log('✓ Test Case 4: Name values length guidelines work correctly.');
  } else {
    console.error('✗ Test Case 4 Failed:', { emptyName, shortName, validName });
  }

  console.log('--- COMPLETED VALIDATION TEST SUITE ---');
}
