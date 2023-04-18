import { runSkfsBasicTest } from './skfs_utils..js';
import { createTestDiskSkfs, createTestSkfs } from './utils.js';

describe('Skfs: mem', () => {
  runSkfsBasicTest('mem', createTestSkfs);
});
describe('Skfs: desk', () => {
  runSkfsBasicTest('disk', createTestDiskSkfs);
});
