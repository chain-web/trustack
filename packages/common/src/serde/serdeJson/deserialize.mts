import type { SerdeItem, SerdeObject } from '../../proto_ts/json.js';
import type { SerdeValueTypes, Serdeobject } from './interface.mjs';

const deserializeItem = (item: SerdeItem): SerdeValueTypes => {
  switch (item.value.oneofKind) {
    case 'stringValue':
      return item.value.stringValue;
    case 'doubleValue':
      return item.value.doubleValue;
    case 'boolValue':
      return item.value.boolValue;
    case 'bigintValue':
      return BigInt(item.value.bigintValue);
    case 'nullValue':
      return null;
    case 'bytesValue':
      return item.value.bytesValue;
    case 'objectValue':
      return deserialize(item.value.objectValue);
    case 'arrayValue':
      return item.value.arrayValue.items.map((item) => deserializeItem(item));
    default:
      throw new Error(`Unsupported type ${item.value.oneofKind}`);
  }
};

export const deserialize = (serdeObj: SerdeObject): Serdeobject => {
  const obj: Serdeobject = {};
  for (const item of serdeObj.fields) {
    obj[item.key] = deserializeItem(item);
  }
  return obj;
};
