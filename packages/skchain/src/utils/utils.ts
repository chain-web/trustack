export const tryParseJson = (str: string): string | object => {
  try {
    return JSON.parse(str);
  } catch (_error) {}
  return str;
};
