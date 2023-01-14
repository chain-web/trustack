import { useActor } from '@xstate/react';
import { Button, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getSelfDid, skService } from '../../../../state/sk.state';
import { MapEventType, mapStateService } from '../../map.state';
import './index.scss';
import { getGridData } from './data.service';
import { GridItemData, GridType } from '../../contract/interface';
import { mapContract } from '../../contract/mapContract';
import { TransStatus } from 'sk-chain';
import { mapDb } from '../../map.db';
import { elementsMeta, ElementTypes } from '../../elements';

export default function GridDrawer() {
  const [{ context }] = useActor(mapStateService);
  const [
    {
      context: { uTime, chain },
    },
  ] = useActor(skService);
  const { activeHex, showGridDetail } = context.grid;
  const [grid, setgrid] = useState<GridItemData>();
  const [gridtype, setgridtype] = useState(GridType.factoryL0);
  const [elementtype, setelementtype] = useState<ElementTypes>('empty');
  const [building, setbuilding] = useState(false);
  const [buildingElem, setbuildingElem] = useState(false);
  const [taking, setTaking] = useState(false);

  // 检查某个交易是否已发出，但未交易完成
  const checkTransStatus = async (
    type: 'take' | 'build' | 'buildElem',
  ): Promise<boolean> => {
    const query = mapDb.trans.where({
      type,
      gridId: activeHex.hexid,
    });
    const txData = await query.toArray();

    if (txData.length) {
      const tx = txData[0].tx;
      const res = await chain.sk.transAction.transStatus(tx);
      console.log(tx, ' : ', res);
      if (
        res.status === TransStatus.transing ||
        res.status === TransStatus.waiting
      ) {
        return true;
      }
      if (
        res.status === TransStatus.transed ||
        res.status === TransStatus.err_tx
      ) {
        await query.delete();
      }
    }
    return false;
  };

  useEffect(() => {
    if (!activeHex?.hexid) {
      return;
    }
    getGridData(activeHex.hexid).then(async (data) => {
      if (data) {
        // console.log(data);
        setgrid(data);
      }
      const takeStatus = await checkTransStatus('take');
      if (takeStatus !== taking) {
        setTaking(takeStatus);
      }

      const buildStatus = await checkTransStatus('build');
      if (buildStatus !== building) {
        setbuilding(buildStatus);
      }

      const buildElemStatus = await checkTransStatus('buildElem');
      if (buildElemStatus !== buildingElem) {
        setbuildingElem(buildElemStatus);
      }
    });
  }, [activeHex, uTime]);

  return (
    <div
      style={{ bottom: showGridDetail ? '0px' : '-256px' }}
      className="grid-msg-box"
    >
      {!!activeHex?.hexid && (
        <div className="grid-msg-content">
          <span
            onClick={() => {
              mapStateService.send(MapEventType.UPDATE_GRID, {
                showGridDetail: false,
              });
            }}
          >
            close
          </span>
          <p>ID: {activeHex.hexid}</p>
          <p>所有者：{grid?.owner || '无'}</p>
          <p>
            {!grid?.owner && (
              <Button
                loading={taking}
                onClick={async () => {
                  const { trans } = await mapContract.toOwn(activeHex.hexid);
                  message.info('taking tx send');
                  setTaking(true);
                  mapDb.trans.add({
                    tx: trans.hash,
                    ts: trans.ts,
                    gridId: activeHex.hexid,
                    type: 'take',
                  });
                }}
              >
                {taking ? 'taking' : 'take'}
              </Button>
            )}
            {/* {grid?.owner === getSelfDid() && (
              <Button
                onClick={() => {
                  skService.state.context.chain.sk.transaction({
                    recipient: localStorage.getItem(contractAddressKey)!,
                    amount: new BigNumber(0),
                    payload: {
                      mothed: 'levelUp',
                      args: [activeHex.hexid],
                    },
                  });
                }}
              >
                level up
              </Button>
            )} */}
          </p>
          <div>
            {grid?.owner === getSelfDid() && (
              <div>
                <div>type: {grid?.data.type}</div>
                <Select
                  value={gridtype}
                  onChange={(e) => {
                    setgridtype(e);
                  }}
                >
                  {Object.keys(GridType).map((ele) => (
                    <Select.Option value={ele} key={ele}>
                      {ele}
                    </Select.Option>
                  ))}
                </Select>
                <p>
                  <Button
                    loading={building}
                    onClick={async () => {
                      const { trans } = await mapContract.changeGridType(
                        activeHex.hexid,
                        gridtype,
                      );
                      setbuilding(true);
                      message.info('building tx send');
                      mapDb.trans.add({
                        tx: trans.hash,
                        ts: trans.ts,
                        gridId: activeHex.hexid,
                        type: 'build',
                      });
                    }}
                  >
                    {building ? 'building' : 'build'}
                  </Button>
                </p>
              </div>
            )}
          </div>
          {/* element type */}
          <div>
            {grid?.owner === getSelfDid() &&
              grid.data.type === GridType.factoryL0 && (
                <div>
                  <div>type: {grid?.data.element}</div>
                  <Select
                    value={elementtype}
                    onChange={(e) => {
                      console.log(e)
                      setelementtype(e);
                    }}
                  >
                    {(Object.keys(elementsMeta) as ElementTypes[]).map(
                      (ele: ElementTypes) => (
                        <Select.Option value={ele} key={ele}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: 16,
                              height: 16,
                              border: '1px solid #111',
                              background: elementsMeta[ele].color,
                            }}
                          ></span>
                          {elementsMeta[ele].symbol}:{elementsMeta[ele].name}
                        </Select.Option>
                      ),
                    )}
                  </Select>
                  <p>
                    <Button
                      loading={buildingElem}
                      onClick={async () => {
                        console.log(elementtype)
                        const { trans } = await mapContract.changeElementType(
                          activeHex.hexid,
                          elementtype,
                        );
                        setbuildingElem(true);
                        message.info('building tx send');
                        mapDb.trans.add({
                          tx: trans.hash,
                          ts: trans.ts,
                          gridId: activeHex.hexid,
                          type: 'build',
                        });
                      }}
                    >
                      {buildingElem ? 'building' : 'build'}
                    </Button>
                  </p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
