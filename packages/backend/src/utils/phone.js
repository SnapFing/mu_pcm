// packages/backend/src/utils/phone.js

const normalizeToE164 = (input) => {
  if (!input) return null;
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('0')) return `+260${digits.slice(1)}`;
  if (digits.startsWith('260')) return `+${digits}`;
  if (digits.length === 9) return `+260${digits}`;
  if (input.startsWith('+')) return `+${digits}`;
  return null;
};

const isValidZambianMobile = (input) => {
  const normalized = normalizeToE164(input);
  if (!normalized) return false;
  // Strict check: +260 followed by 97,98,76,77,96,95 + 7 digits
  const regex = /^\+260(97|98|76|77|96|95)\d{7}$/;
  return regex.test(normalized);
};

const formatDisplay = (input) => {
  const normalized = normalizeToE164(input);
  if (!normalized) return input;
  const raw = normalized.slice(1);
  if (raw.length === 12) {
    return `+${raw.slice(0, 3)} ${raw.slice(3, 5)} ${raw.slice(5, 9)} ${raw.slice(9)}`;
  }
  return normalized;
};

module.exports = { normalizeToE164, isValidZambianMobile, formatDisplay };