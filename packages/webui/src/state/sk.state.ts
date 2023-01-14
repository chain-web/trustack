import { message } from 'antd';
import { DidJson, LifecycleStap } from 'sk-chain';
import {
  assign,
  createMachine,
  interpret,
  MachineConfig,
  StateSchema,
} from 'xstate';
import { SkChain } from './sk';
interface SkNodeMachineContext {
  chain: SkChain;
  chainOpts: {
    forceReady?: boolean;
  };
  uTime: number;
}

export enum SkNodeEventType {
  'START_CHAIN' = 'START_CHAIN',
  'CONFIG_CHAIN' = 'CONFIG_CHAIN',
  'BLOCK_HEIGHT_CHAIGE' = 'BLOCK_HEIGHT_CHAIGE',
}

export type SkNodeStateEvent =
  | { type: SkNodeEventType.START_CHAIN; data: DidJson }
  | { type: SkNodeEventType.BLOCK_HEIGHT_CHAIGE }
  | {
      type: SkNodeEventType.CONFIG_CHAIN;
      data: Partial<SkNodeMachineContext['chainOpts']>;
    };

export interface SkNodeStateSchema extends StateSchema {
  states: {
    stop: {};
    start: {};
    started: {
      type: 'compound';
      initial: 'idle';
      states: {
        idle: {};
      };
    };
  };
}

export type RenderStateConfig = MachineConfig<
  SkNodeMachineContext,
  SkNodeStateSchema,
  SkNodeStateEvent
>;

export const skNodesMachine = createMachine<SkNodeMachineContext>(
  {
    id: 'skNode',
    initial: 'stop',
    context: {
      chain: new SkChain(),
      chainOpts: {},
      uTime: Date.now(),
    },
    states: {
      stop: {
        on: {
          [SkNodeEventType.START_CHAIN]: { target: 'start' },
          [SkNodeEventType.CONFIG_CHAIN]: {
            actions: assign({
              chainOpts: (context, data) => {
                return {
                  ...context.chainOpts,
                  ...data,
                };
              },
            }),
          },
        },
      },
      start: {
        invoke: {
          id: 'init-sk',
          src: (context, event) => {
            return context.chain.init({
              id: event.id,
              privKey: event.privKey,
            } as unknown  as DidJson); // TODO add edPriv and edPub
          },
          onDone: {
            target: 'started',
            // actions:assign({})
          },
          onError: {
            actions: (c, err) => {
              console.error('init sk-chain err');
              console.log(err);
            },
            target: 'stop',
          },
        },
        // entry: assign({ count: (ctx) => ctx.count + 1 }),
      },
      started: {
        type: 'compound',
        initial: 'idle',
        states: {
          idle: {
            type: 'atomic',
            entry: (context) => {
              const { forceReady } = context.chainOpts;
              context.chain.sk.consensus.setIsReady(Boolean(forceReady));
              console.log('started-------idle');
              // 监听sk-chain事件，更新状态机
              context.chain.sk.lifecycleEvents.onEmit((key, ..._data) => {
                if (key === LifecycleStap.newBlock) {
                  skService.send(SkNodeEventType.BLOCK_HEIGHT_CHAIGE);
                }
              });
            },
            on: {
              [SkNodeEventType.BLOCK_HEIGHT_CHAIGE]: {
                actions: assign({
                  uTime: (_ctx) => Date.now(),
                }),
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {},
  },
);

export const skService = interpret(skNodesMachine);

skService.start();

export const getSelfDid = () => skService.state.context.chain.sk?.did;
