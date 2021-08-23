export enum CustomValueType {
  TIMESTAMP,
  UUID,
  STRING,
  INT,
  FLOAT,
}

export type SchemaTypes =
  | {
      type: 'array';
      of: CustomValueType;
      dimensions: number;
      lengths: number[];
    }
  | { type: CustomValueType; value?: GeneratedValue };

export type Schema = {
  [key: string]: SchemaTypes;
};

export type ParsedSchema = {
  [key: string]: GeneratedValue | GeneratedValueArray;
};

export type CustomType = CustomValueType | CustomValueType[];

export type GeneratedValue = Date | number | string;

type Elem = GeneratedValueArray;
export interface GeneratedValueArray extends Array<Elem | GeneratedValue> {}

export type TypeToValueMapper = (value: CustomValueType) => GeneratedValue;