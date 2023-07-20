declare interface SkUtilsI {
  name: 'sk_utils';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(arg: any): void;
  storage: string;
  save_storage(data: string): void;
  gen_cid(data: string | number): string;
}

declare const __sk_utils__: SkUtilsI;
