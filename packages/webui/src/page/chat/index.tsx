import { useActor } from '@xstate/react';
import { Input } from 'antd';
import { useState } from 'react';
import { chatService, initChatService } from './chat.state';

initChatService();

export const Chat = () => {
  const [{ context }] = useActor(chatService);

  const [ipt, setipt] = useState('');

  if (!context.chat) {
    return null;
  }

  return (
    <div
      className="chat-box"
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
      <div className="msg-list">
        {context.msgList.map((ele) => (
          <div>
            {ele.from}: {ele.msg}
          </div>
        ))}
      </div>
      <div
        className="ipt-box"
        style={{ position: 'absolute', bottom: 0, width: '100%', padding: 12 }}
      >
        <Input
          style={{ width: '100%' }}
          onChange={(e) => {
            setipt(e.target.value);
          }}
          value={ipt}
          onKeyPress={(e) => {
            if (e.code === 'Enter' && ipt) {
              context.chat.sendMsg(ipt);
              setipt('');
            }
          }}
        />
      </div>
    </div>
  );
};
