import { describe, it, expect } from 'vitest';
import { validateEmail, sanitizeInput, safeParsePositiveNumber, validateName } from '../utils/validation';

describe('Validation Utility Tests', () => {
  describe('validateEmail', () => {
    it('should validate structured emails successfully', () => {
      expect(validateEmail('test@ecomail.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email structures', () => {
      expect(validateEmail('invalid-email-address')).toBe(false);
      expect(validateEmail('abc@xyz')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });

    it('should return false for empty or falsy strings', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should strip simple HTML/XML tags completely', () => {
      const parsedXss = sanitizeInput('<script>alert(1);</script>Liam');
      expect(parsedXss).toBe('alert(1);Liam');
    });

    it('should escape specific special characters to avoid XSS', () => {
      // "<to>" is stripped completely by design as it matches the HTML regex. Let's verify other HTML escaping characters.
      const escaped = sanitizeInput('Hello & welcome "Lumen"\'s site');
      expect(escaped).toBe('Hello &amp; welcome &quot;Lumen&quot;&#x27;s site');
    });

    it('should return empty string for falsy/empty values', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('safeParsePositiveNumber', () => {
    it('should parse valid numbers within standard limits', () => {
      expect(safeParsePositiveNumber('123', 0, 1000)).toBe(123);
      expect(safeParsePositiveNumber(55, 0, 100)).toBe(55);
    });

    it('should bound negative values or values below min to min', () => {
      expect(safeParsePositiveNumber('-50', 0, 1000)).toBe(0);
      expect(safeParsePositiveNumber('5', 10, 100)).toBe(10);
    });

    it('should bound excessive values exceeding max to max', () => {
      expect(safeParsePositiveNumber('2500', 0, 1000)).toBe(1000);
    });

    it('should fallback to min limit when input is unparseable', () => {
      expect(safeParsePositiveNumber('abc', 10, 500)).toBe(10);
    });
  });

  describe('validateName', () => {
    it('should reject blank or whitespace-only names', () => {
      const result = validateName('   ');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('cannot be blank');
    });

    it('should reject excessively short names', () => {
      const result = validateName('A');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('at least 2 characters');
    });

    it('should reject excessively long names to enforce process limits', () => {
      const result = validateName('A'.repeat(51));
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('must not exceed 50 characters');
    });

    it('should validate standard name input successfully', () => {
      const result = validateName('Elizabeth');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });
});
