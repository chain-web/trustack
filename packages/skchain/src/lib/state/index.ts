import { assign, createMachine, interpret } from 'xstate';
import { message } from '../../utils/message.js';

export type ChainEvents =
  | { type: 'CHANGE'; event: string }
  | { type: 'INITIALIZE' }
  | { type: 'START' }
  | { type: 'ERROR' }
  | { type: 'STARTED' };

export interface ChainContext {
  event: string;
}

// chain state
const chainMachine = createMachine<ChainContext, ChainEvents>({
  id: 'chain-state',
  initial: 'inactive',
  predictableActionArguments: true,
  context: {
    event: '',
  },
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
                assign({
                  event: 'START',
                }),
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
            assign({
              event: 'INITIALIZE',
            }),
          ],
        },
      },
    },
    starting: {
      on: {
        STARTED: 'active',
        CHANGE: {
          actions: [
            (_, e) => {
              message.info('starting: ', e.event);
            },
            assign({
              event: (_ctx, e) => e.event,
            }),
          ],
        },
      },
    },
    active: { on: { ERROR: 'inactive' } },
  },
});

export const chainState = interpret(chainMachine)
  // .onEvent((state) => console.log(state))
  .start();
