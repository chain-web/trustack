import { tryParseExistJson, tryParseJson } from '../utils.js';

describe('utils utils', () => {
  describe('test', () => {
    it('should json parse ok', async () => {
      const jsonObj = {
        a: 1,
        b: '2',
        c: {
          d: 3,
          e: '4',
        },
      };
      const jsonStr = JSON.stringify(jsonObj);
      const jsonStr2 = 'some test string';

      const tryParse = tryParseJson(jsonStr);
      expect(tryParse).toEqual(jsonObj);

      const tryParse2 = tryParseJson(jsonStr2);
      expect(tryParse2).toEqual(jsonStr2);

      const tryParse3 = tryParseExistJson(jsonStr);
      expect(tryParse3).toEqual(jsonObj);

      const tryParse4 = tryParseExistJson(jsonStr2);
      expect(tryParse4).toEqual(undefined);
    });
  });
});
