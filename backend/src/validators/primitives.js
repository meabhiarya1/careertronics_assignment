/**
 * Small, dependency-free parsers for request input.
 * Each parser pushes `{ field, message }` into `errors` instead of throwing,
 * so a request can report every invalid field at once.
 */

const isMissing = (value) => value === undefined || value === '';

const readSingle = (value, field, errors) => {
  if (Array.isArray(value)) {
    errors.push({ field, message: `${field} must be provided only once` });
    return undefined;
  }
  return value;
};

export function parseInteger(rawValue, { field, min, max, fallback }, errors) {
  const value = readSingle(rawValue, field, errors);
  if (isMissing(value)) return fallback;

  const number = Number(value);
  const outOfRange = (min !== undefined && number < min) || (max !== undefined && number > max);

  if (!Number.isInteger(number) || outOfRange) {
    const range = max !== undefined ? `between ${min} and ${max}` : `>= ${min}`;
    errors.push({ field, message: `${field} must be an integer ${range}` });
    return fallback;
  }
  return number;
}

export function parseEnum(rawValue, { field, allowed, fallback }, errors) {
  const value = readSingle(rawValue, field, errors);
  if (isMissing(value)) return fallback;

  if (!allowed.includes(value)) {
    errors.push({ field, message: `${field} must be one of: ${allowed.join(', ')}` });
    return fallback;
  }
  return value;
}

export function parseString(rawValue, { field, maxLength }, errors) {
  const value = readSingle(rawValue, field, errors);
  if (isMissing(value)) return undefined;

  const trimmed = String(value).trim();
  if (trimmed.length > maxLength) {
    errors.push({ field, message: `${field} must be at most ${maxLength} characters` });
    return undefined;
  }
  return trimmed || undefined;
}
