export { BUILDER_NAMES } from './ast.utils.js';
import { parseSync, transformSync } from '@swc/core';
import { buildCodeString as builder } from './builder.js';
import type { BuildCodeString } from './index.js';

export const buildCodeString: BuildCodeString = async (code) => {
  const buildCode = builder(code, {
    parseSync,
    transformSync,
  });

  return buildCode;
};
