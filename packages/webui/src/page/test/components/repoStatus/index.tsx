import React, { useEffect, useState } from 'react';
import { skService } from '../../../../state/sk.state';
import './index.scss';
import { useActor } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import { lanKeys } from './index.i18n';
import { JsonView } from '../../../../components/JsonView';

export default function RepoStatus() {
  const [current] = useActor(skService);
  const [t] = useTranslation();
  const [time, settime] = useState<NodeJS.Timeout>();
  const [repoStatus, setRepoStatus] = useState<object>();
  const [showBlock, setshowBlock] = useState(false);
  useEffect(() => {
    getHeaderBlock();
    return () => {
      clearTimeout(time!);
    };
  }, []);

  const node = current.context.chain.sk;
  const getHeaderBlock = () => {
    node.db.repo.stat().then((res) => {
      setRepoStatus(res);
      const id = setTimeout(() => {
        getHeaderBlock();
      }, 1500);
      settime(id);
    });
  };
  return (
    <div className="status-box">
      <h3>{t(lanKeys.repoStatus)}</h3>

      <div className="status-item">
        {repoStatus && <JsonView data={repoStatus} />}
      </div>
      <div className="status-item">
        <Button
          onClick={async () => {
            const itr = node.db.repo.gc();
            for await (const block of itr) {
              console.log('gc: ', block.cid?.toString());
            }
          }}
        >
          GC
        </Button>
      </div>

      {showBlock && (
        <Modal
          visible={true}
          title={t(lanKeys.repoStatus)}
          onCancel={() => {
            setshowBlock(false);
          }}
          footer={null}
          className="nodestatus-peer-list-modal-box"
        ></Modal>
      )}
    </div>
  );
}
