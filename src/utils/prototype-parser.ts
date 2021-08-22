import { map, Observable, reduce, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { randomFloat, randomNum, randomString } from './helpers';
import {
  CustomValueType,
  GeneratedValue,
  GeneratedValueArray,
  ValueGenerator,
} from './util-types';

const parseValue = (type: CustomValueType): GeneratedValue => {
  switch (type) {
    case CustomValueType.NUMBER:
      return randomNum(1, 1000000);
    case CustomValueType.UUID:
      return uuidv4();
    case CustomValueType.TIMESTAMP:
      return new Date(Date.now());
    case CustomValueType.STRING:
      return randomString();
    case CustomValueType.INT:
      return randomNum(1, 1000000);
    case CustomValueType.FLOAT:
      return randomFloat(1, 1000000);
    default:
      throw new Error('Invalid value type');
  }
};

export const prototypeParser = (
  obs: Observable<[string, ValueGenerator]>
): Observable<any> => {
  return obs.pipe(
    map(
      ([key, value]: [string, ValueGenerator]): [
        string,
        GeneratedValue | GeneratedValueArray
      ] => [key, value(parseValue)]
    ),
    reduce(
      (
        acc: any,
        [key, value]: [string, GeneratedValue | GeneratedValueArray]
      ) => {
        return { ...acc, [key]: value };
      },
      {}
    )
  );
};
