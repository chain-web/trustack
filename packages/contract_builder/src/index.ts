export { BUILDER_NAMES } from './ast.utils.js';
export type BuildCodeString = (code: string) => Promise<{ code: string }>;

// only for export type
// runtime code will be export by ./node.mts and ./browser.mts
export const buildCodeString: BuildCodeString = async (code) => {
  return { code };
};
