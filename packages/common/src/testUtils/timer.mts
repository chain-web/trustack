export const wait = async (timeout: number): Promise<boolean> => {
  return new Promise((reslove) => {
    setTimeout(() => {
      reslove(true);
    }, timeout);
  });
};
