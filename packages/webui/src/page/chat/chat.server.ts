import { SKChain, bytes } from 'sk-chain';

const skChatKey = 'sk_chat_map_app_key';

export interface MessageItem {
  msg: string;
  from: string;
  ts: number;
}

type MessageListener = (msg: MessageItem) => void;

export class ChatServer {
  constructor(chain: SKChain) {
    this.chain = chain;
    this.init();
  }

  chain: SKChain;
  listener: MessageListener[] = [];

  public async listenMsg(fn: MessageListener) {
    this.listener.push(fn);
  }
  public async sendMsg(msg: string) {
    const msgData = {
      text: msg,
      ts: Date.now(),
    };
    this.chain.db.pubsub.publish(
      skChatKey,
      bytes.fromString(JSON.stringify(msgData)),
    );
  }

  private init() {
    this.chain.db.pubsub.subscribe(skChatKey, async (data: any) => {
      // if (data.from === this.chain.did) {
      //   return;
      // }

      try {
        const msg = JSON.parse(bytes.toString(data.data));
        // console.log(msg);
        // TODO 校验签名
        this.listener.forEach((ele) => {
          ele({ msg: msg.text, from: data.from, ts: msg.ts });
        });
      } catch (error) {
        console.log(error);
      }
    });
  }
}
