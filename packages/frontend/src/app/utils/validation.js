// packages/frontend/src/utils/validation.js

/**
 * Validate an email address.
 * Returns { isValid: boolean, error: string | null }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required.' };
  }
  // Standard email regex: local@domain.tld
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address (e.g., name@example.com).' };
  }
  return { isValid: true, error: null };
};

/**
 * Normalize a phone number to E.164 format (+260XXXXXXXXX).
 * Returns null if invalid.
 */
export const normalizePhone = (input) => {
  if (!input) return null;
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('0')) return `+260${digits.slice(1)}`;
  if (digits.startsWith('260')) return `+${digits}`;
  if (digits.length === 9) return `+260${digits}`;
  if (input.startsWith('+')) return `+${digits}`;
  return null;
};

/**
 * Validate a Zambian mobile phone number.
 * Returns { isValid: boolean, error: string | null, formatted: string | null }
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required.', formatted: null };
  }
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return { isValid: false, error: 'Invalid phone format. Use e.g. 0971234567 or +260971234567.', formatted: null };
  }
  // Strict Zambian mobile: +260 97|98|76|77|96|95 + 7 digits
  const regex = /^\+260(97|98|76|77|96|95)\d{7}$/;
  if (!regex.test(normalized)) {
    return { isValid: false, error: 'Must be a valid Zambian mobile number (e.g., 0971234567).', formatted: normalized };
  }
  return { isValid: true, error: null, formatted: normalized };
};