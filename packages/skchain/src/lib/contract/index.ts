import { CONTRACT_CLASS_NAME } from '@faithstack/contract';
import type { EvaluateResult } from '@faithstack/vm';
import { evaluate, init } from '@faithstack/vm';
import { bytes } from 'multiformats';
import { LOAD_CONTRACT_DATA_FUNC } from '../../config/index.js';
import type { Transaction } from '../../mate/transaction.js';
import { message } from '../../utils/message.js';
import { chainState } from '../state/index.js';
import { LifecycleStap } from '../state/lifecycle.js';
import { generateBaseContractCode } from './codeSnippet.js';

export interface ContractResult {
  saves: ContractResultSaveItem[];
  funcReturn: any;
}

export interface ContractResultSaveItem {
  key: string;
  value: { [key: string]: any };
  type: 'object' | 'sk_slice_db';
  // keyType?: SliceKeyType;
}

export class Contract {
  ready = false;
  evaluate = evaluate;

  public init = async (): Promise<void> => {
    await init();
    this.ready = true;
    chainState.send('CHANGE', {
      event: LifecycleStap.initedContract,
    });
  };

  runContract = (
    code: Uint8Array,
    trans: Transaction,
    cuLimit: bigint,
    storage: Uint8Array,
  ): EvaluateResult => {
    const codeStr = bytes.toString(code);
    const method = trans.payload?.method;
    if (!method) {
      throw new Error('no contract call method');
    }
    const args = trans.payload?.args || [];
    const funcCallCode = `
      const __run__class__ = new ${CONTRACT_CLASS_NAME}()
      __run__class__.${method}(${args.join(',')})
    `;
    const loadDataCode = `${LOAD_CONTRACT_DATA_FUNC}()`;
    const allCode = `
      ${generateBaseContractCode()}
      ${codeStr}
      // ${loadDataCode}
      ${funcCallCode}
    `;
    const result = this.evaluate(allCode, cuLimit);
    return result;
  };

  // /**
  //  * @description 把 js function 处理成code string后交给runtime去执行
  //  * @param code [Function] js function
  //  * @returns
  //  */
  // runFunction = (
  //   code: Uint8Array,
  //   trans: Transaction,
  //   storage: string,
  // ): ContractResult => {
  //   const runCode = `
  //   const baseContractKey = ['msg']
  //   const cwjsrSk = __init__sk__()
  //   const __sk__ = {
  //     log: cwjsrSk.log,
  //     transMsg: {
  //       sender: {did: '${trans.from.did}'},
  //       ts: ${trans.ts}
  //     },
  //     constractHelper: {
  //       createSliceDb: (keyType) => {
  //         return {
  //           get (key) {
  //             return this.data[key];
  //           },
  //           set (key, val) {
  //             this.data[key] = val;
  //           },
  //           delete (key) {
  //             delete this.data[key];
  //           },
  //           data: {},
  //           type: 'sk_slice_db',
  //           keyType: keyType
  //         }
  //       },
  //       hash: cwjsrSk.genRawHash,
  //       log: cwjsrSk.log,
  //     }
  //   }
  //   ${codeStr}
  //   const run = () => {
  //     let funcReturn;
  //     ${(() => {
  //       if (method !== 'constructor' && storage) {
  //         let loadDataCode = `let savedData = JSON.parse('${storage}')`;
  //         loadDataCode += `
  //         savedData.forEach(ele => {
  //           if (ele.type === 'sk_slice_db') {
  //             __sk__contract[ele.key] = __sk__.constractHelper.createSliceDb(ele.keyType);
  //             __sk__contract[ele.key].data = ele.value;
  //           } else {
  //             __sk__contract[ele.key] = ele.value;
  //           }
  //         })
  //         `;
  //         loadDataCode += `
  //         funcReturn = __sk__contract.${method}(${trans.payload?.args
  //           .map((ele) => `'${ele}'`)
  //           .join(',')})
  //         `;
  //         return loadDataCode;
  //       }
  //       return '__sk__contract.__sk__constructor();';
  //     })()}
  //     const saves = Object.keys(__sk__contract).map(key => {
  //       let ele = __sk__contract[key];
  //       const type = typeof ele;
  //       if (baseContractKey.includes(key) || type === 'function') {
  //         return
  //       }
  //       if (type === 'object' && ele.type === 'sk_slice_db') {
  //         return {
  //           key: key,
  //           value: ele.data,
  //           type: 'sk_slice_db',
  //           keyType: ele.keyType
  //         }
  //       }
  //       return {
  //         key,
  //         type,
  //         value: ele
  //       }
  //     }).filter(ele => !!ele)
  //     return JSON.stringify({saves, funcReturn});
  //   };
  //   run();
  //   `;
  //   // console.log(runCode);
  //   let result = this.evaluate(runCode, BigInt(trans.cuLimit.toString()), {});
  //   result = result.replace(/("$)|(^")/g, '');
  //   return JSON.parse(result);
  // };
}
