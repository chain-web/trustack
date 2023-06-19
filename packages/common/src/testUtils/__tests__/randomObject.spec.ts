import assert from 'node:assert';
import { bytes } from 'multiformats';
import { randomJson } from '../../../dist/testUtils/randomObject.mjs';
import { serialize } from '../../../dist/serde/serdeJs/serialize.mjs';
import { deserialize } from '../../../dist/serde/serdeJs/deserialize.mjs';

describe('serde json', () => {
  describe('test', () => {
    it('should random json ok', async () => {
      for (let i = 0; i < 100; i++) {
        randomJson(i * 10);
        randomJson(i * 5);
      }
    });
    it('should simple use ok', async () => {
      let jsonBinaryLen = 0;
      let serdeJsonLen = 0;

      for (let i = 0; i < 100; i++) {
        const json = randomJson(20);
        jsonBinaryLen += bytes.fromString(JSON.stringify(json)).length;
        const serdeJson = serialize(json);
        serdeJsonLen += serdeJson.length;
        const back = deserialize(serdeJson);
        assert.deepEqual(back, json);
      }
      expect(serdeJsonLen).toBeLessThan(jsonBinaryLen * 1.2);
    });
    // TODO performance test
  });
});
