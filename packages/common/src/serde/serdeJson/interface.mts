export type Serdeobject = { [ket: string]: SerdeValueTypes };

export type SerdeValueTypes =
  | string
  | number
  | boolean
  | null
  | bigint
  | undefined
  | Serdeobject
  | SerdeValueTypes[]
  | Uint8Array;
