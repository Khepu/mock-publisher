export enum CustomValueType {
  TIMESTAMP = 'timestamp',
  UUID = 'uuid',
  NUMBER = 'number',
  STRING = 'string',
  INT = 'int',
  FLOAT = 'float',
}

export type CustomType = CustomValueType | CustomValueType[];

export type GeneratedValue = Date | number | string;

type Elem = GeneratedValueArray;
export interface GeneratedValueArray extends Array<Elem | GeneratedValue> {}

export type TypeToValueMapper = (value: CustomValueType) => GeneratedValue;

export type ValueGenerator = (
  mapper: TypeToValueMapper
) => GeneratedValue | GeneratedValueArray;
