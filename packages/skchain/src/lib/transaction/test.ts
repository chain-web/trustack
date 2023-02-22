import type { Transaction, transMeta } from '../../mate/transaction.js';
import { genetateDid } from '../p2p/did.js';

import type { SKChain } from '../../skChain.js';
import { Contract } from '../contract/index.js';
import { accountOpCodes } from '../contract/code.js';
import { transDemoFn } from '../contracts/transaction_demo.js';
import type { UpdateAccountI } from '../ipld/index.js';
import { createEmptyStorageRoot } from '../ipld/util.js';
import {
  genTransMeta,
  genTransactionClass,
  runContract,
} from './trans.pure.js';
import { newAccount } from './../../mate/account.js';
import type { Account } from './../../mate/account.js';
import { SKChainLibBase } from './../base.js';

// 处理交易活动
export class TransactionTest extends SKChainLibBase {
  constructor(chain: SKChain) {
    super(chain);
    this.contract = new Contract();
  }

  private contract: Contract;
  account!: Account;

  init = async (): Promise<void> => {
    await this.contract.init();
  };

  doTransTask = async (trans: Transaction): Promise<UpdateAccountI[]> => {
    let update: UpdateAccountI[] = [];

    if (trans.payload) {
      // 调用合约
      const res = await runContract(
        this.account,
        trans,
        this.chain,
        this.contract,
      );

      if (res.opCode === accountOpCodes.updateState) {
        const cid = await this.chain.db.dag.put([res.value]);
        this.account.updateState(cid);
        await this.account.commit(this.chain.db);
      }

      update.push(res);
    } else {
      // 普通转账
      update = await transDemoFn(
        {
          from: trans.from.did,
          recipient: trans.recipient.did,
          amount: trans.amount,
        },
        this.chain.ipld.getAccount,
      );
    }

    return update;
  };

  handelTransaction = async (trans: Transaction): Promise<UpdateAccountI[]> => {
    return await this.doTransTask(trans);
  };

  transaction = async (
    tm: Pick<transMeta, 'amount' | 'recipient'> & {
      payload?: Transaction['payload'];
    },
  ): Promise<{
    trans: Transaction;
  }> => {
    const transMeta = await genTransMeta(tm, this.chain);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const trans = await genTransactionClass(transMeta!, this.chain);
    await this.handelTransaction(trans);
    return { trans };
  };

  // deploy contract
  deploy = async (meta: {
    payload: Uint8Array;
  }): Promise<{
    trans: Transaction;
  }> => {
    // TODO 要不要加update code 的接口
    const newDid = await genetateDid();
    const storageRoot = await createEmptyStorageRoot(this.chain.db);
    const codeCid = await this.chain.db.block.put(meta.payload);
    const account = newAccount(
      newDid.id,
      storageRoot,
      codeCid.toV1(),
      this.chain.did,
    );
    await account.commit(this.chain.db);
    this.account = account;
    return await this.transaction({
      amount: new BigNumber(0),
      recipient: account.account,
      payload: {
        method: 'constructor',
        args: [meta.payload],
      },
    });
  };
}
