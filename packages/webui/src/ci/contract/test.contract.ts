import { BaseContract } from 'skchain';

export class TestContract extends BaseContract {
  constructor() {
    super();
    this.data = {
      value: 10000000000000n,
    };
  }

  data: { [key: string]: bigint } = {};

  public getValue = (): bigint => {
    return this.data.value;
  };
}
