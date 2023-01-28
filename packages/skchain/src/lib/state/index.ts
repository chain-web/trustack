import { message } from 'utils/message.js';
import { assign, createMachine, interpret } from 'xstate';

type ChainEvents =
  | { type: 'CHANGE'; event: string }
  | { type: 'INITIALIZE' }
  | { type: 'START' }
  | { type: 'ERROR' }
  | { type: 'STARTED' };

interface ChainContext {
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
      states: {
        initializing: {
          on: {
            START: {
              target: '..starting',
              actions: () => {
                message.info('to starting');
                assign({
                  event: 'START',
                });
              },
            },
          },
        },
      },
      on: {
        INITIALIZE: {
          target: 'inactive.initializing',
          actions: () => {
            message.info('to initializing');
            assign({
              event: 'INITIALIZE',
            });
          },
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
              assign({
                event: e.event,
              });
            },
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
