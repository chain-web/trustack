import { bytes } from 'multiformats';
import { sleep } from '../../../tests/skchainTest.util.js';
import {
  logClassPerformance,
  logPerformance,
  performanceCollecter,
} from '../performance.js';

@logClassPerformance()
class testClass {
  str = '';

  init() {
    while (this.str.length <= 100000) {
      this.str += Math.random().toFixed(5);
    }
  }
  toBytes() {
    return bytes.fromString(this.str);
  }
  async timer() {
    await sleep(1100);
  }

  @logPerformance
  get strlen() {
    return this.str.length;
  }

  set strlen(len: number) {
    len;
  }
}

describe('logPerformance', () => {
  describe('test', () => {
    it('should logPerformance ok', async () => {
      const tc = new testClass();
      tc.init();
      expect(tc.str.length).toBeGreaterThan(100000);
      const _bts = tc.toBytes();
      tc.strlen = 100;
      tc.strlen;
      await tc.timer();
      if (performanceCollecter.enabled) {
        // performanceCollecter.print();
        const toBytesLog = performanceCollecter.logs.find(
          (log) => log.funcName === 'toBytes',
        );
        if (!toBytesLog) {
          throw new Error('no toBytesLog');
        }
        expect(toBytesLog.stack.pop()).toEqual('toBytes');
        expect(toBytesLog.stack.pop()).toEqual('testClass');

        const timerLog = performanceCollecter.logs.find(
          (log) => log.funcName === 'timer',
        );
        if (!timerLog) {
          throw new Error('no timerLog');
        }
        expect(timerLog.cost).toBeGreaterThan(1 * 1e9);
      }
    }, 2000);
  });
});
