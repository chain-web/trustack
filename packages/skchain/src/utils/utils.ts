export const tryParseJson = (str: string): string | object => {
  try {
    return JSON.parse(str);
  } catch (_error) {}
  return str;
};

export const tryParseExistJson = (str: string): undefined | object => {
  try {
    return JSON.parse(str);
  } catch (_error) {}
  return;
};
