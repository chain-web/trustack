import { Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { skNodesMachine } from '../../../../state/sk.state';
import './index.scss';
import { useMachine } from '@xstate/react';

export default function ConnectTo() {
  const [current] = useMachine(skNodesMachine);
  const [mdir, setmdir] = useState('');
  const [loading, setloading] = useState(false);
  return (
    <div className="home-connect-to">
      <Input
        value={mdir}
        onChange={(e) => {
          setmdir(e.target.value);
        }}
      />
      <Button
        loading={loading}
        onClick={async () => {
          try {
            console.log(mdir);
            message.info('try to connect' + mdir);
            setloading(true);
            const maddr = (window as any).Multiaddr.multiaddr(mdir);
            console.log(maddr);
            await current.context.chain.sk.db.swarm.connect(maddr);
            setloading(false);
          } catch (error) {
            console.log(error);
            // message.error(error as string);
            setloading(false);
          }
        }}
      >
        connect
      </Button>
    </div>
  );
}
