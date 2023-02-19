import type { Address } from 'skchain';
import { BaseContract } from 'skchain';

/**
 * @desc 子货币例子
 */
export class CoinContract extends BaseContract {
  constructor() {
    super();
    // 初始化代币余额
    this.balances = {
      '12D3KooWHdhPrGCqsjD8j6yiHfumdzxfRxyYNPxJKN99RfgtoRuq': 10000n,
    };
  }

  // private 不可被外部读取
  private balances: { [key: string]: bigint };

  // public 可被外部调用
  public send = (receiver: Address, amount: bigint): void => {
    if (this.balances[receiver.did] > amount) {
      return;
    }
    if (!this.balances[receiver.did]) {
      this.balances[receiver.did] = 0n;
    }
    this.balances[receiver.did] += amount;
    this.balances[this.msg.sender.did] -= amount;
  };

  public getBalance = (address: Address): bigint => {
    return this.balances[address.did];
  };
}
