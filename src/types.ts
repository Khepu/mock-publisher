import { Observable } from 'rxjs';

export type Configuration = {
  connectionUri: string;
  publishQueueName: string;
  consumeQueueName: string;
  schema: Observable<Schema>;
  intervalMillis: number;
  isEnvironmentInstance?: boolean;
  host?: string;
};

export enum CustomValueType {
  TIMESTAMP = 'timestamp',
  UUID = 'uuid',
  STRING = 'string',
  INT = 'int',
  FLOAT = 'float',
}

export const StaticValue: 'static' = 'static';

export const ArrayValue: 'array' = 'array';

export type SchemaTypes =
  | {
      type: 'array';
      of: CustomValueType;
      dimensions: number;
      lengths: number[];
    }
  | { type: CustomValueType }
  | {
      type: 'static';
      value: GeneratedValue | GeneratedValueArray;
    };

export type Schema = {
  [key: string]: SchemaTypes;
};

export type ParsedSchema = {
  [key: string]: GeneratedValue | GeneratedValueArray;
};

export type CustomType = CustomValueType | CustomValueType[];

export type GeneratedValue = Date | number | string;

//type Elem = GeneratedValueArray;
export interface GeneratedValueArray
  extends Array<GeneratedValueArray | GeneratedValue> {}

export type ToValueParser = (value: string) => GeneratedValue;

export type ValueGenerator = (
  parser: ToValueParser
) => GeneratedValue | GeneratedValueArray;
