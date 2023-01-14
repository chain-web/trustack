
          import { ConstractHelper, BaseContract } from 'sk-chain';
          import { ElementTypes } from '../elements';
import { GridType } from './interface';
export declare class Contract extends BaseContract {
    constructor();
    private userDb;
    private gridDb;
    static levelBase: number;
    toOwn: (hexid: string) => ConstractHelper.ContractFuncReruen<{
        succ: boolean;
    }>;
    changeElementType: (hexid: string, type: ElementTypes) => ConstractHelper.ContractFuncReruen<{
        succ: boolean;
    }>;
    changeGridType: (hexid: string, type: GridType) => ConstractHelper.ContractFuncReruen<{
        succ: boolean;
    }>;
    levelUp: (did: string) => ConstractHelper.ContractFuncReruen<void>;
    private checkLevelDown;
}
declare class Address {
    did: string;
}
declare class BaseContract {
    msg: {
        sender: Address;
        ts: number;
    };
}
export {};
