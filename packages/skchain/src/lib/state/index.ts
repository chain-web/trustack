import { createMachine, interpret } from 'xstate';
import { message } from '../../utils/message.js';
import type { LifecycleStap } from './lifecycle.js';

export type ChainEvents = {
  type: 'CHANGE' | 'INITIALIZE' | 'START' | 'ERROR' | 'STARTED' | 'STOP';
  event?: LifecycleStap;
  data?: string[];
};

export interface ChainContext {
  eventQueue: { event: string; data?: string[] }[];
}

// chain state
const chainMachine = createMachine<ChainContext, ChainEvents>(
  {
    id: 'chain-state',
    initial: 'inactive',
    predictableActionArguments: true,
    context: {
      eventQueue: [],
    },
    type: 'parallel',
    states: {
      inactive: {
        initial: 'uncreated',
        states: {
          initializing: {
            on: {
              START: {
                target: '..starting',
                actions: [
                  () => {
                    message.info('to starting');
                  },
                ],
              },
            },
          },
          uncreated: {},
        },
        on: {
          INITIALIZE: {
            target: 'inactive.initializing',
            actions: [
              () => {
                message.info('to initializing');
              },
            ],
          },
        },
      },
      starting: {
        on: {
          STARTED: 'active',
        },
      },
      active: {
        on: {
          ERROR: 'inactive',
          STOP: 'inactive',
        },
      },
    },
    on: {
      CHANGE: {
        actions: ['update'],
      },
    },
  },
  {
    actions: {
      update: (ctx, e) => {
        message.info('state event: ', e, ...(e.data || []));
        if (e.event) {
          ctx.eventQueue.push({ event: e.event, data: e.data });
        }
      },
    },
  },
);

const chainStateInterpret = interpret(chainMachine);

class ChainState {
  constructor() {
    this.state.start();
    this.send = this.state.send;
  }
  state = chainStateInterpret;
  send: (typeof chainStateInterpret)['send'];

  onLifecycle(step: LifecycleStap, cb: (data?: string[]) => void): void {
    this.state.onEvent((event) => {
      const chainEvent = event as ChainEvents;
      if (chainEvent.type === 'CHANGE') {
        if (chainEvent.event === step) {
          cb(chainEvent.data);
        }
      }
    });
  }

  async waitForLifecycle(step: LifecycleStap): Promise<string[] | undefined> {
    const res = await new Promise<string[] | undefined>((reslove) => {
      this.onLifecycle(step, (data) => {
        reslove(data);
      });
    });
    return res;
  }

  getSnapshot() {
    return this.state.getSnapshot();
  }
}

export const chainState = new ChainState();
