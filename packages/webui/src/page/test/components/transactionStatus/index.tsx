import React, { useEffect, useState } from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { JsonView } from '../../../../components/JsonView';
import { lanKeys } from './index.i18n';

export default function TransactionStatus() {
  const [t] = useTranslation();
  const [blocks, _setBlocks] = useState<object>({});
  const [showBlock, setshowBlock] = useState(false);
  const [, setUpdate] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setUpdate((update) => update + 1);
    }, 1000);
  }, []);

  // TODO 名字直接copy的blockStatus，得改
  // const node = current.context.chain;
  // const getHeaderBlock = () => {
  //   const blockGets: any[] = [];
  //   node.blockService.getHeaderBlock().then((res) => {
  //     node.db.dag.get(CID.parse(res.header.transactionsRoot)).then((res) => {
  //       res.value.Links.forEach((link: any) => {
  //         blockGets.push(Transaction.fromCid(node.db, link.Hash.toString()));
  //       });

  //       Promise.all(blockGets).then((res) => {
  //         const obj: any = {};
  //         res.map((ele: Transaction) => {
  //           obj[ele.hash] = ele;
  //         });
  //         setshowBlock(true);
  //         setBlocks(obj);
  //       });
  //     });
  //   });
  // };
  return (
    <div className="status-box">
      <h3>{t(lanKeys.transactionStatus)}</h3>

      <div className="status-item">
        {/* <Button onClick={getHeaderBlock}>👀</Button> */}
      </div>
      <div className="status-item">
        <span>{t(lanKeys.transing_count)}: </span>
        {/* <span>{node.transAction.status.transingArr.length}</span> */}
      </div>
      <div className="status-item">
        <span>{t(lanKeys.wait_count)}: </span>
        {/* <span>{node.transAction.status.waitTransCount}</span> */}
      </div>

      {showBlock && (
        <Modal
          visible={true}
          width={800}
          title={t(lanKeys.transactionStatus)}
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
