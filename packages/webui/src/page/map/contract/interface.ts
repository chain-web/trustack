import { ElementTypes } from '../elements';

export interface GridItemData {
  id: string;
  owner: string;
  level: number;
  uTime: number;
  data: Factory0Data | EmptyGridData;
}

export interface Factory0Data {
  type: GridType.factoryL0;
  element: ElementTypes;
}

export interface EmptyGridData {
  type: GridType.empty;
}

export enum GridType {
  'empty' = '',
  'factoryL0' = 'factoryL0',
  // 'factoryL1' = 'factoryL1',
  // 'lab' = 'lab',
}

export interface UserData {
  rs: {
    coin: BigInt;
    clay: BigInt;
    coal: BigInt;
    bricks: BigInt;
  };
}
