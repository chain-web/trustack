import { SKChain } from 'sk-chain';
import {
  assign,
  createMachine,
  interpret,
  MachineConfig,
  StateSchema,
} from 'xstate';
import { skService } from '../../state/sk.state';
import { ChatServer, MessageItem } from './chat.server';
interface ChatMachineContext {
  chat: ChatServer;
  msgList: MessageItem[];
}

export enum ChatEventType {
  'INIT_CHAT' = 'INIT_CHAT',
  'ADD_MESSAGE' = 'ADD_MESSAGE',
}

export type ChatStateEvent =
  | { type: ChatEventType.INIT_CHAT; data: SKChain }
  | { type: ChatEventType.ADD_MESSAGE; data: MessageItem };

export interface ChatStateSchema extends StateSchema {
  initial: 'uninit';
  states: {
    uninit: {};
    inited: {};
  };
}

export type ChatStateConfig = MachineConfig<
  ChatMachineContext,
  ChatStateSchema,
  ChatStateEvent
>;
const ChatMachineConfig: ChatStateConfig = {
  id: 'skNode',
  initial: 'uninit',
  context: {
    chat: undefined as unknown as ChatServer,
    msgList: [],
  },
  states: {
    uninit: {
      on: {
        [ChatEventType.INIT_CHAT]: {
          actions: [
            assign({
              chat: (_ctx, event) => {
                return new ChatServer(event.data);
              },
            }),
          ],
          target: 'inited',
        },
      },
    },
    inited: {
      entry: (ctx) => {
        ctx.chat.listenMsg((msg) => {
          chatService.send(ChatEventType.ADD_MESSAGE, { data: msg });
        });
      },
      on: {
        [ChatEventType.ADD_MESSAGE]: {
          actions: [
            assign({
              msgList: (ctx, event) => {
                ctx.msgList.push(event.data);
                return ctx.msgList;
              },
            }),
          ],
        },
      },
    },
  },
};

export const ChatMachine = createMachine(ChatMachineConfig);

export const chatService = interpret(ChatMachine);

chatService.start();

export const initChatService = () => {
  skService.onTransition((e) => {
    if (!chatService.state.context.chat && e.matches('started')) {
      chatService.send(ChatEventType.INIT_CHAT, {
        data: e.context.chain.sk,
      });
    }
  });
};
