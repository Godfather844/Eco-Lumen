/**
 * Utility functions for form validation and input sanitization.
 * Helps prevent XSS injection attacks and ensures proper data typing.
 */

/**
 * Validates whether a given string is a correctly structured email address.
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  // Standard robust RFC 5322 email regex check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Strips HTML tags and suspicious chars from input to mitigate basic scripting injection.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // strip HTML/XML tags
    .replace(/[&<>"']/g, (match) => {
      const escapeMap: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return escapeMap[match] || match;
    });
}

/**
 * Parses and sanitizes numerical input, ensuring positive bounded limits.
 */
export function safeParsePositiveNumber(value: string | number, min = 0, max = 1000000): number {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return min;
  return Math.max(min, Math.min(max, numericValue));
}

/**
 * Validates display name to protect against empty records and lengthy injections.
 */
export function validateName(name: string): { isValid: boolean; message: string } {
  const sanitized = name.trim();
  if (sanitized.length === 0) {
    return { isValid: false, message: 'Name cannot be blank. Please enter your name.' };
  }
  if (sanitized.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long.' };
  }
  if (sanitized.length > 50) {
    return { isValid: false, message: 'Name must not exceed 50 characters to prevent processing limits.' };
  }
  return { isValid: true, message: '' };
}
