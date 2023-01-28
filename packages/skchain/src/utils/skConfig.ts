import type { CreateBrowserNodeConfig } from '../node.browser.js';

export const checkInitOption = (
  config: Partial<CreateBrowserNodeConfig>,
): boolean => {
  if (!config.account?.id || !config.account?.privKey) {
    throw new Error('[sk init config]: shuld provide account, id and privKey');
  }
  return true;
};
