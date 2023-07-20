// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gh = globalThis as any;
if (gh.__sk_utils__?.name !== 'sk_utils') {
  gh.__sk_utils__ = {};
}

export type ContractFuncReruen<T> = Promise<{
  origin: T;
  trans: string;
}>;

export class SliceDb<T> {
  db: Map<string, T> = new Map();

  get = this.db.get;
  set = this.db.set;
  has = this.db.has;
  delete = this.db.delete;
}

export const createSliceDb: <T>() => SliceDb<T> = () => {
  return new SliceDb();
};

export const hash = (str: string): string => {
  return __sk_utils__.gen_cid(str);
};

export const log = __sk_utils__.log;
