import { chainState } from '../../lib/state/index.js';
import { message } from '../message.js';

describe('message mosule', () => {
  describe('test', () => {
    it('should message write log ok', async () => {
      chainState.name = 'test_message';
      message.init();
      message.info('test message info');
      const file = await message.readFile();
      expect(file).toContain('test message info');
    });
  });
});
