import { ElementTypes } from '../elements';
import { GridItemData, GridType } from './interface';

export const factoryLevelUp = () => {
  return '';
};

export const initGridData = (type: GridType): GridItemData['data'] => {
  switch (type) {
    case GridType.empty:
      return { type };
    case GridType.factoryL0:
      return {
        type,
        element: 'empty',
      };
  }
};

export const initElementData = (type: ElementTypes): GridItemData['data'] => {
  return {
    type: GridType.factoryL0,
    element: type,
  };
};
