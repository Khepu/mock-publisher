import { from, map, Observable, reduce } from 'rxjs';
import { v4 } from 'uuid';
import {
  CustomValueType,
  GeneratedValue,
  GeneratedValueArray,
  ParsedSchema,
  Schema,
  SchemaTypes,
  ToValueParser,
  ValueGenerator,
} from '../types';
import { randomFloat, randomNum, randomString } from './helpers';

const parseSchemaType: ToValueParser = type => {
  switch (type) {
    case CustomValueType.FLOAT:
      return randomFloat(1, 100);
    case CustomValueType.INT:
      return randomNum(1, 100);
    case CustomValueType.STRING:
      return randomString();
    case CustomValueType.TIMESTAMP:
      return new Date(Date.now());
    case CustomValueType.UUID:
      return v4();
    default:
      throw new Error('Invalid schema');
  }
};

const getRange = (end: number) =>
  Object.keys(new Array(end).fill(0)).map(num => parseInt(num));

const splitArray = (ar: any[], every: number) =>
  getRange(ar.length / every).map(num => {
    return ar.slice(num * every, (num + 1) * every);
  });

const generateArray =
  (lengths: number[], dimensions: number, of: CustomValueType) =>
  (parser: ToValueParser) => {
    const numOfElems = lengths.reduce((acc, cur) => {
      return cur * acc;
    }, 1);
    const values = getRange(numOfElems).map(_ => parser(of));

    const generateArrayAux = (
      n: number,
      acc: GeneratedValueArray
    ): GeneratedValueArray => {
      if (n <= 0) return acc;
      else return generateArrayAux(n - 1, splitArray(acc, lengths[n - 1]));
    };

    return generateArrayAux(
      dimensions - 1,
      splitArray(values, lengths[dimensions - 1])
    )[0];
  };

const parseArray =
  (schemaType: SchemaTypes) =>
  (parser: ToValueParser): GeneratedValue | GeneratedValueArray => {
    if (schemaType.type === 'array') {
      const { dimensions, of, lengths } = schemaType;
      return generateArray(lengths, dimensions, of)(parser);
    }
    if (schemaType.value !== undefined) return schemaType.value;
    else return parser(schemaType.type);
  };

export const parseSchema = (schema: Schema): Observable<ParsedSchema> => {
  return from(Object.entries(schema)).pipe(
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
};
