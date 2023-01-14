import { initGridData } from './../../contract/util';
import { bytes, CID, ConstractHelper } from 'sk-chain';
import { skService } from '../../../../state/sk.state';
import { sha256 } from 'multiformats/hashes/sha2';
import { message } from 'antd';
import { GridItemData, GridType } from '../../contract/interface';
import { contractAddressKey } from '../../contract/mapContract';
export const getGridData = async (
  hexid: string,
): Promise<GridItemData | undefined> => {
  if (!skService.state.context.chain.started) {
    return;
  }
  const chain = skService.state.context.chain.sk;
  const account = localStorage.getItem(contractAddressKey);
  if (!account) {
    message.error('please deploy first');
    return;
  }
  const storageRoot = (await chain.ipld.getAccount(account)).storageRoot;
  if (!storageRoot) {
    message.error('no storage root');
    return;
  }
  const storage = (await chain.db.dag.get(storageRoot)).value[0];
  const hash = await sha256.digest(bytes.fromString(hexid));
  const data: ConstractHelper.ContractResultItem[] = JSON.parse(
    storage || '[]',
  );
  const result = data.find((item) => item.key === 'gridDb');
  if (!result || !result.value) {
    message.error('no grid data');
    return;
  }
  const did = CID.createV1(0x55, hash).toString();
  if (result.value[did]) {
    const dataCid = CID.parse(result.value[did]);
    const gridData = await chain.db.dag.get(dataCid);
    return gridData.value as GridItemData;
  } else {
    return {
      id: hexid,
      owner: '',
      level: 0,
      uTime: 0,
      data: initGridData(GridType.empty),
    };
  }
};
