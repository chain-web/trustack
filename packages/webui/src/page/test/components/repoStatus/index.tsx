import React, { useEffect, useState } from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import { JsonView } from '../../../../components/JsonView';
import { lanKeys } from './index.i18n';

export default function RepoStatus() {
  const [t] = useTranslation();
  const [time, _settime] = useState<NodeJS.Timeout>();
  const [repoStatus, _setRepoStatus] = useState<object>();
  const [showBlock, setshowBlock] = useState(false);
  useEffect(() => {
    getHeaderBlock();
    return () => {
      clearTimeout(time);
    };
  }, []);

  const getHeaderBlock = () => {
    // node.db.repo.stat().then((res) => {
    //   setRepoStatus(res);
    //   const id = setTimeout(() => {
    //     getHeaderBlock();
    //   }, 1500);
    //   settime(id);
    // });
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
            // const itr = node.db.repo.gc();
            // for await (const block of itr) {
            //   console.log('gc: ', block.cid?.toString());
            // }
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
