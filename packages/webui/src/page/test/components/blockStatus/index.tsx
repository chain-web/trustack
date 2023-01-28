import React, { useEffect, useState } from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import { JsonView } from '../../../../components/JsonView';
import { lanKeys } from './index.i18n';

export default function BlockStatus() {
  const [t] = useTranslation();
  const [blocks, _setBlocks] = useState<object>({});
  const [showBlock, setshowBlock] = useState(false);
  useEffect(() => {}, []);

  const getHeaderBlock = () => {
    // const setGets: any[] = [];
    // const blockGets: any[] = [];
    // node.blockService.blockRoot.rootNode.Links.forEach((set) => {
    //   setGets.push(node.db.dag.get(set.Hash));
    // });
    // Promise.all(setGets)
    //   .then((res) => {
    //     res.forEach((set) => {
    //       set.value.forEach((blockCid: string) => {
    //         blockGets.push(node.db.dag.get(CID.parse(blockCid)));
    //       });
    //     });
    //   })
    //   .then(() => {
    //     Promise.all(blockGets).then((res) => {
    //       const obj: any = {};
    //       res.map((ele: { value: any }) => {
    //         obj[ele.value.hash] = ele.value;
    //       });
    //       setshowBlock(true);
    //       setBlocks(obj);
    //     });
    //   });
  };
  return (
    <div className="status-box">
      <h3>{t(lanKeys.blockStatus)}</h3>

      <div className="status-item">
        <Button onClick={getHeaderBlock}>👀</Button>
      </div>

      {showBlock && (
        <Modal
          visible={true}
          width={800}
          title={t(lanKeys.blockStatus)}
          onCancel={() => {
            setshowBlock(false);
          }}
          footer={null}
          className=""
        >
          {blocks && <JsonView data={blocks} />}
        </Modal>
      )}
    </div>
  );
}
