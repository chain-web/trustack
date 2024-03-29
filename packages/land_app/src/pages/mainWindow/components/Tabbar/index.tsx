import { Button, Modal, Tabs } from 'antd';
import { useActor } from '@xstate/react';
import { useState } from 'react';
// import GridDrawer from '../GridDrawer';
import './index.scss';
// import { Contract as CtrClass } from '../../contract/index';
// import CtrCode from '../../contract/index.contract';
// import { DeployContract } from '../../../test/components/contract/DeployContract';
// import { TestContract } from '../../../test/components/contract/TestContract';
// import { contractAddressKey } from '../../contract/mapContract';
import { chainState } from '../../../../chain/skchain';

const TabPane = Tabs.TabPane; // TODO use item config
// const DeployContractComp = DeployContract(CtrClass, CtrCode);
// const TestContractComp = TestContract(CtrClass, CtrCode);
export default function Tabbar() {
  const [showNodeModal, setshowNodeModal] = useState(true);
  return (
    <div className="tabbar-box">
      <Tabs tabPosition={'bottom'} defaultActiveKey="home">
        <TabPane forceRender tab="home" key="home" className="tabbar-item-box">
          {/* <Button
            onClick={async () => {
              const data = mapDb.trans.toArray();
              console.log(data);
            }}
          >
            getMapDb
          </Button> */}
          {/* <Button
            onClick={async () => {
              const data = await mapDb.trans
                .where('ts')
                .below(Date.now())
                .delete();
              console.log('delete', data);
            }}
          >
            clear mapDb.trans
          </Button> */}
          {/* <Button
            onClick={() => {
              setshowNodeModal(true);
            }}
            style={{ float: 'right' }}
          >
            node
          </Button> */}
          <div
            style={{
              visibility: chainState.started ? 'visible' : 'hidden',
            }}
            id="map-container"
          />
          {/* <GridDrawer /> */}
          {/* <Modal
            visible={showNodeModal}
            onCancel={() => {
              setshowNodeModal(false);
            }}
            style={{ top: 0 }}
            maskClosable={false}
            footer={null}
          >
            <DeployContractComp
              onSuccess={(trans) => {
                localStorage.setItem(contractAddressKey, trans.recipient.did);
              }}
            />
            <TestContractComp />
          </Modal> */}
        </TabPane>
        {/* <TabPane
          forceRender
          style={{ overflow: 'auto' }}
          className="tabbar-item-box"
          tab="node"
          key="node"
        >
          
        </TabPane> */}
        <TabPane forceRender className="tabbar-item-box" tab="mine" key="mine">
          mine
        </TabPane>
      </Tabs>
    </div>
  );
}
