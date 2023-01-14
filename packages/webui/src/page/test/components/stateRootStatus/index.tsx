import React, { useEffect, useState } from 'react';
import { skService } from '../../../../state/sk.state';
import './index.scss';
import { useActor } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import { lanKeys } from './index.i18n';
import { JsonView } from '../../../../components/JsonView';
import { CID } from 'sk-chain';

export default function StateRootStatus() {
  const [current] = useActor(skService);
  const [t] = useTranslation();
  const [time, settime] = useState<NodeJS.Timeout>();
  const [accounts, setAccounts] = useState<object>({});
  const [showBlock, setshowBlock] = useState(false);
  useEffect(() => {}, []);

  const node = current.context.chain.sk;
  const getHeaderBlock = () => {
    node.getHeaderBlock().then((res) => {
      node.db.dag.get(CID.parse(res.header.stateRoot)).then((res) => {
        const len = res.value.Links.length;
        Promise.all(
          res.value.Links.map((item: any) => {
            return node.db.dag.get(item.Hash);
          }),
        ).then((res) => {
          const obj: any = {};
          res.map((ele: { value: any }) => {
            obj[ele.value[0]] = ele.value;
          });
          setshowBlock(true);
          setAccounts(obj);
        });
      });
    });
  };
  return (
    <div className="status-box">
      <h3>{t(lanKeys.stateRootStatus)}</h3>

      <div className="status-item">
        <Button onClick={getHeaderBlock}>👀</Button>
      </div>

      {showBlock && (
        <Modal
          visible={true}
          width={800}
          title={t(lanKeys.stateRootStatus)}
          onCancel={() => {
            setshowBlock(false);
          }}
          footer={null}
          className=""
        >
          {accounts && <JsonView data={accounts} />}
        </Modal>
      )}
    </div>
  );
}
