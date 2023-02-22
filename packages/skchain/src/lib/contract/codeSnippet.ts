export const generateBaseContractCode = (): string => {
  return `
    class BaseContract {}
  `;
};

export const bigIntJsonify = `
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
`;
