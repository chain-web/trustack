import type { Resource } from 'i18next';

type lankeysBaseI = { [key: string]: string };

type lanKeysI<T extends Resource> = {
  [key in keyof T['en']['translations']]: key;
};

export const genLanKeys = <T extends Resource>(lan: T): lanKeysI<T> => {
  const keyMap: lankeysBaseI = {};
  Object.keys(lan.en.translations).forEach((ele: string) => {
    keyMap[ele] = ele;
  });

  return keyMap as unknown as lanKeysI<T>;
};
