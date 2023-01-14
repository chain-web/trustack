import { actions, createMachine, interpret } from 'xstate';

type ChainEvents =
  | { type: 'CHANGE'; event: string }
  | { type: 'INITIALIZE' }
  | { type: 'START' }
  | { type: 'ERROR' }
  | { type: 'STARTED' };

// chain state
const chainMachine = createMachine<any, ChainEvents>({
  id: 'chain-state',
  initial: 'inactive',
  predictableActionArguments: true,
  states: {
    inactive: {
      states: {
        initializing: {
          on: {
            START: {
              target: '..starting',
              actions: () => {
                console.log('to starting');
              },
            },
          },
        },
      },
      on: {
        INITIALIZE: {
          target: 'inactive.initializing',
          actions: () => {
            console.log('to initializing');
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
              console.log('starting: ', e.event);
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
