import type { SKChain } from 'skchain';

export const deepGetCid = async (
  db: SKChain['db'],
  // cid: CID
): Promise<object> => {
  // const obj = await db.dag.get(cid);
  // if (obj.value?.Links) {
  //   for (let i = 0; i < obj.value.Links.length; i++) {
  //     const ele = obj.value.Links[i];
  //     obj.value.Links[i] = await deepGetCid(db, ele.Hash);
  //   }
  // }
  // return obj.value;
  return {};
};
