import { LifecycleStap } from '@trustack/common';
import { chainState } from '../index.js';

describe('chainState', () => {
  describe('test', () => {
    it('should change state ok', () => {
      chainState.send('INITIALIZE');
      expect(chainState.getSnapshot().matches('inactive.initializing')).toEqual(
        true,
      );
      chainState.send('START');
      expect(chainState.getSnapshot().matches('starting')).toEqual(true);
      chainState.send('STARTED');
      expect(chainState.getSnapshot().matches('active')).toEqual(true);
    });

    it('should update event ok', () => {
      chainState.send('INITIALIZE');
      expect(chainState.getSnapshot().matches('inactive.initializing')).toEqual(
        true,
      );

      chainState.send('CHANGE', {
        event: 'test_event',
      });
      const state1 = chainState.getSnapshot().context;
      expect(state1.eventQueue[0].event).toEqual('test_event');
      chainState.send('START');
      expect(chainState.getSnapshot().matches('starting')).toEqual(true);

      chainState.send('CHANGE', {
        event: 'test_event2',
      });
      const state2 = chainState.getSnapshot().context;
      expect(state2.eventQueue[1].event).toEqual('test_event2');
      chainState.send('STARTED');
      expect(chainState.getSnapshot().matches('active')).toEqual(true);

      chainState.send('CHANGE', {
        event: 'test_event3',
      });
      const state3 = chainState.getSnapshot().context;
      expect(state3.eventQueue[2].event).toEqual('test_event3');
      expect(state3.eventQueue.length).toEqual(3);
    });
    it('should listen lifecycle event ok', async () => {
      let eventData: string[] = [];
      chainState.onLifecycle(LifecycleStap.newBlock, (data) => {
        if (!data) {
          throw new Error('no data');
        }
        eventData = data;
      });
      chainState.send('CHANGE', {
        event: LifecycleStap.newBlock,
        data: ['test'],
      });
      expect(eventData[0]).toEqual('test');

      setTimeout(() => {
        chainState.send('CHANGE', {
          event: LifecycleStap.syncingHeaderBlock,
          data: ['test'],
        });
      }, 1000);

      const result = await chainState.waitForLifecycle(
        LifecycleStap.syncingHeaderBlock,
      );

      if (!result) {
        throw new Error('no result');
      }

      expect(result[0]).toEqual('test');
    });
  });
});
