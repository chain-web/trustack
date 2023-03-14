export const writeCodeToFile = async (code: string): Promise<void> => {
  let isNodejs = false;
  try {
    // eslint-disable-next-line import/no-nodejs-modules
    import('module');
    isNodejs = true;
  } catch (error) {}
  if (isNodejs) {
    // eslint-disable-next-line import/no-nodejs-modules
    const { resolve } = (await import('path')).default;
    // eslint-disable-next-line import/no-nodejs-modules
    const { writeFileSync } = (await import('fs')).default;

    const codeFile = resolve('./', `./__contract_code__.js`);
    writeFileSync(codeFile, code, {
      flag: 'w',
    });
  }
};
