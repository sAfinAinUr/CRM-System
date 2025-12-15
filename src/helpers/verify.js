export function verifyText(text) {
  if (text.length < 2 || text.length > 65) {
    return { mean: true, message: 'invalid length of characters' };
  } else if (text.trim().length < 2) {
    return { mean: true, message: 'invalid format' };
  }

  return { mean: false };
}
