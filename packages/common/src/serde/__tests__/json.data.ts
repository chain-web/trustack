/* eslint-disable @typescript-eslint/no-explicit-any */
export const randomJson = (jsonSize = 10, maxDeep = 10000): object => {
  let deep = 0;
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  const randomString = (): string => {
    const length = Math.floor(Math.random() * 10);
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  };

  const randomNumber = (): number => Math.random() * 1000;

  const randomBoolean = (): boolean => Math.random() > 0.5;

  const randomNull = (): null => null;

  const randomUndefined = (): undefined => undefined;

  const randomUint8Array = (): Uint8Array => {
    const length = Math.floor(Math.random() * 10);
    return Uint8Array.from({ length }, () => Math.floor(Math.random() * 256));
  };

  const randomBigInt = (): bigint =>
    BigInt(Math.floor(Math.random() * 100000000000000000000000));

  const randomArray = (size = 10): any[] => {
    if (deep > maxDeep) {
      return [randomString()];
    }
    const length = Math.floor(Math.random() * size);
    return Array.from({ length }, () => randomValue());
  };

  const randomValue = (): any => {
    deep++;
    const random = Math.random();
    if (random < 0.1) {
      return randomNull();
    }
    if (random < 0.2) {
      return randomUndefined();
    }
    if (random < 0.3) {
      return randomBoolean();
    }
    if (random < 0.4) {
      return randomBigInt();
    }
    if (random < 0.5) {
      return randomUint8Array();
    }
    if (random < 0.6) {
      return randomString();
    }
    if (random < 0.7) {
      return randomNumber();
    }
    if (random < 0.8) {
      return randomArray();
    }
    return randomObject();
  };

  const randomObject = (size = 10): object => {
    if (deep > maxDeep) {
      return { [randomString()]: randomString() };
    }
    const length = Math.floor(Math.random() * size);
    const keys = Array.from({ length }, () => randomString());
    const obj: any = {};
    for (const key of keys) {
      obj[key] = randomValue();
    }
    return obj;
  };

  return randomObject(jsonSize);
};
