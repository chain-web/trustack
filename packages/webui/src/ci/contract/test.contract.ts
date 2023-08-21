import { random } from 'lodash';
import { add } from './test_func';

// TODO add extends BaseContract
export class TestContract {
  constructor() {
    this.data = {
      value: 10000000000000n,
      random: BigInt(add(1, random(1, 100))),
    };
  }

  data: { [key: string]: bigint } = {};

  public getValue = (): bigint => {
    return this.data.value;
  };
}
