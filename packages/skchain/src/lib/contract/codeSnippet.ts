import type { Address } from '../../mate/address.js';

export const generateBaseContractCode = (sender: Address): string => {
  return `
    class BaseContract {
      constructor () {
        this.msg = {
          sender: ${sender.toParam()}
        }
      }
      msg = {sender: {}}
    }
  `;
};

export const bigIntJsonify = `
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
`;
