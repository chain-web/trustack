import { useActor } from '@xstate/react';
import { Button, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';

let pc: RTCPeerConnection;

export const WRTCConn = () => {
  const [ipt, setipt] = useState('');
  const [offer, setoffer] = useState('');
  const [offer2, setoffer2] = useState('');
  const [answer, setanswer] = useState('');
  const [answer2, setanswer2] = useState('');
  const [ice, setIcce] = useState('');

  useEffect(() => {
    pc = new RTCPeerConnection({
      iceServers: [
        {
          username:
            'LR2yK642l2Wxi-N3OTKIvFKOLhArKmh7bz4p77Ot2twGAgdRR9Uwt9RhqX8aMPtkAAAAAGLeckxzY29jbw==',
          credential: 'b70cf8ac-0c05-11ed-a53d-0242ac120004',
          urls: [
            'turn:hk-turn1.xirsys.com:80?transport=udp',
            'turn:hk-turn1.xirsys.com:3478?transport=udp',
            'turn:hk-turn1.xirsys.com:80?transport=tcp',
            'turn:hk-turn1.xirsys.com:3478?transport=tcp',
            'turns:hk-turn1.xirsys.com:443?transport=tcp',
            'turns:hk-turn1.xirsys.com:5349?transport=tcp',
          ],
        },
      ],
      // iceCandidatePoolSize: 10,
      iceTransportPolicy: 'relay',
    });
    pc.addEventListener('connectionstatechange', (event) => {
      if (pc.connectionState === 'connected') {
        console.log('conned');
      }
    });

    pc.addEventListener('icecandidate', (e) => {
      if (e.candidate) {
        try {
          pc.addIceCandidate(e.candidate);
          setIcce(e.candidate.candidate);
          console.log('addIceCandidate succ');
        } catch (error) {
          console.log(error);
        }
      }
    });

    pc.addEventListener('iceconnectionstatechange', (e) => {
      console.log('iceconnectionstatechange', e);
    });

    pc.addEventListener('icegatheringstatechange', (e) => {
      console.log('icegatheringstatechange', e);
    });

    pc.addEventListener('icecandidateerror', (e) => {
      console.log(e);
    });

    const sendChannel = pc.createDataChannel('test');
    sendChannel.addEventListener('open', () => {
      console.log('sendChannel open');
    });
    sendChannel.addEventListener('close', () => {
      console.log('sendChannel close');
    });
  }, []);

  const start = async () => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    setoffer(JSON.stringify(offer));
  };

  const setOffer2 = async () => {
    const offer2Obj = JSON.parse(offer2);
    console.log('offer2Obj', offer2Obj);
    await pc.setRemoteDescription(offer2Obj);
    const as = await pc.createAnswer();
    pc.setLocalDescription(as);
    setanswer(JSON.stringify(as));
  };

  const setAnswer2 = async () => {
    const answer2Obj = JSON.parse(answer2);
    console.log('answer2Obj', answer2Obj);
    await pc.setRemoteDescription(answer2Obj);

    // pc.iceGatheringState
    // pc.addIceCandidate()
  };

  return (
    <div
      className="chat-box"
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
      <Button onClick={start}>start</Button>
      <div>
        <span>offer</span>
        <TextArea
          style={{
            width: 300,
            height: 100,
          }}
          value={offer}
        />
      </div>

      <div>
        <span>offer 2</span>
        <TextArea
          style={{
            width: 300,
            height: 100,
          }}
        />
        <Button onClick={setOffer2}>set offer2</Button>
      </div>

      <div>
        <span>answer</span>
        <TextArea
          style={{
            width: 300,
            height: 100,
          }}
          value={answer}
        />
      </div>

      <div>
        <span>answer 2</span>
        <TextArea
          style={{
            width: 300,
            height: 100,
          }}
        />
        <Button onClick={setAnswer2}>setAnswer2</Button>
      </div>

      <div>
        <span>ice</span>
        <TextArea
          style={{
            width: 300,
            height: 100,
          }}
          value={ice}
        />
      </div>

      <pre>{ipt}</pre>
    </div>
  );
};
