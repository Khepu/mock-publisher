import { from, map, Observable, reduce } from 'rxjs';
import { v4 } from 'uuid';
import {
  ArrayValue,
  CustomValueType,
  GeneratedValue,
  GeneratedValueArray,
  ParsedSchema,
  Schema,
  SchemaTypes,
  StaticValue,
  ToValueParser,
  ValueGenerator,
} from '../types';
import { getRange, randomFloat, randomNum, randomString } from './helpers';

const parseSchemaType: ToValueParser = type => {
  switch (type) {
    case CustomValueType.FLOAT:
      return randomFloat(-1, 1);
    case CustomValueType.INT:
      return randomNum(0, 100);
    case CustomValueType.STRING:
      return randomString(10, 20);
    case CustomValueType.TIMESTAMP:
      return new Date(Date.now());
    case CustomValueType.UUID:
      return v4();
    default:
      throw new Error('Invalid schema');
  }
};

const splitArray = (array: any[], every: number) =>
  getRange(array.length / every).map(num =>
    array.slice(num * every, (num + 1) * every)
  );

const generateArray =
  (lengths: number[], dimensions: number, of: string) =>
  (parser: ToValueParser) => {
    const numOfElems = lengths.reduce((acc, cur) => cur * acc, 1);

    const values = getRange(numOfElems).map(_ => parser(of));

    const generateArrayAux = (
      n: number,
      acc: GeneratedValueArray
    ): GeneratedValueArray =>
      n <= 0 ? acc : generateArrayAux(n - 1, splitArray(acc, lengths[n - 1]));

    return generateArrayAux(
      dimensions - 1,
      splitArray(values, lengths[dimensions - 1])
    )[0];
  };

const parseArray =
  (schemaType: SchemaTypes) =>
  (parser: ToValueParser): GeneratedValue | GeneratedValueArray => {
    if (schemaType.type === undefined) {
      throw new Error('Invalid Schema');
    } else if (schemaType.type === StaticValue) {
      return schemaType.value;
    } else if (schemaType.type === ArrayValue) {
      const { dimensions, of, lengths } = schemaType;
      if (dimensions !== lengths.length) {
        throw new Error('Invalid Schema');
      }
      return generateArray(lengths, dimensions, of)(parser);
    } else {
      return parser(schemaType.type);
    }
  };

export const parseSchema = (schema: Schema): Observable<ParsedSchema> =>
  from(Object.entries(schema)).pipe(
    map(([key, value]: [string, SchemaTypes]): [string, ValueGenerator] => [
      key,
      parseArray(value),
    ]),
    map(
      ([key, valueGenerator]: [string, ValueGenerator]): [
        string,
        GeneratedValue | GeneratedValueArray
      ] => [key, valueGenerator(parseSchemaType)]
    ),
    reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  );
