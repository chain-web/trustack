import type { SerdeItem } from '../../proto_ts/json.js';
import { SerdeObject } from '../../proto_ts/json.js';
import type { SerdeJsValueTypes } from './interface.mjs';

const serializeItem = (key: string, value: SerdeJsValueTypes): SerdeItem => {
  const type = typeof value;
  switch (type) {
    case 'string':
      return {
        key,
        value: {
          oneofKind: 'stringValue',
          stringValue: value,
        },
      } as SerdeItem;
    case 'number':
      return {
        key,
        value: {
          oneofKind: 'doubleValue',
          doubleValue: value,
        },
      } as SerdeItem;
    case 'boolean':
      return {
        key,
        value: {
          oneofKind: 'boolValue',
          boolValue: value,
        },
      } as SerdeItem;
    case 'bigint':
      return {
        key,
        value: {
          oneofKind: 'bigintValue',
          bigintValue: value?.toString(),
        },
      } as SerdeItem;
    case 'undefined':
      return {
        key,
        value: {
          oneofKind: 'nullValue',
          nullValue: true,
        },
      } as SerdeItem;
    case 'object':
      if (value === null) {
        return {
          key,
          value: {
            oneofKind: 'nullValue',
            nullValue: true,
          },
        } as SerdeItem;
      } else if (value instanceof Uint8Array) {
        return {
          key,
          value: {
            oneofKind: 'bytesValue',
            bytesValue: value,
          },
        } as SerdeItem;
      } else if (Array.isArray(value)) {
        return serializeArray(key, value);
      } else {
        return {
          key,
          value: {
            oneofKind: 'objectValue',
            objectValue: {
              fields: Object.entries(value as object).map(([key, value]) =>
                serializeItem(key, value),
              ),
            },
          },
        } as SerdeItem;
      }

    default:
      throw new Error(`Unsupported type ${type}`);
  }
};

const serializeArray = (key: string, value: SerdeJsValueTypes[]): SerdeItem => {
  return {
    key,
    value: {
      oneofKind: 'arrayValue',
      arrayValue: { items: value.map((item) => serializeItem(key, item)) },
    },
  } as SerdeItem;
};

export const serialize = (object: object): Uint8Array => {
  const serdeJson: SerdeObject = { fields: [] };
  if (Array.isArray(object)) {
    throw new Error('Arrays are not supported, use serializeArray instead');
  }
  if (typeof object === 'object') {
    for (const [key, value] of Object.entries(object)) {
      serdeJson.fields.push(serializeItem(key, value));
    }
  }
  return SerdeObject.toBinary(serdeJson);
};
