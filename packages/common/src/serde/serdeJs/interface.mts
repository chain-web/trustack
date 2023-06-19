export type SerdeJsObjectType = { [ket: string]: SerdeJsValueTypes };

export type SerdeJsValueTypes =
  | string
  | number
  | boolean
  | null
  | bigint
  | undefined
  | SerdeJsObjectType
  | SerdeJsValueTypes[]
  | Uint8Array;
