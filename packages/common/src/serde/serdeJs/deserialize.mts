import type { SerdeItem } from '../../proto_ts/json.js';
import { SerdeObject } from '../../proto_ts/json.js';
import type { SerdeJsObjectType, SerdeJsValueTypes } from './interface.mjs';

const deserializeItem = (item: SerdeItem): SerdeJsValueTypes => {
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
      return deserializeObject(item.value.objectValue);
    case 'arrayValue':
      return item.value.arrayValue.items.map((item) => deserializeItem(item));
    default:
      throw new Error(`Unsupported type ${item.value.oneofKind}`);
  }
};

const deserializeObject = (serdeObj: SerdeObject): SerdeJsObjectType => {
  const obj: SerdeJsObjectType = {};
  for (const item of serdeObj.fields) {
    obj[item.key] = deserializeItem(item);
  }
  return obj;
};

export const deserialize = <T extends SerdeJsObjectType>(
  serdeBinary: Uint8Array,
): T => {
  const serdeObj = SerdeObject.fromBinary(serdeBinary);
  const obj: SerdeJsObjectType = {} as T;
  for (const item of serdeObj.fields) {
    obj[item.key] = deserializeItem(item);
  }
  return obj as T;
};
