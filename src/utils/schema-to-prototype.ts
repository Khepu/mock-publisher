import { map, from, Observable } from 'rxjs';
import { isArray, wrapWithArrray } from './helpers';
import {
  CustomType,
  GeneratedValue,
  GeneratedValueArray,
  TypeToValueMapper,
  ValueGenerator,
} from './util-types';

type SchemaToPrototypeProps = { [key: string]: CustomType };

const parseArray =
  (value: CustomType) =>
  (mapper: TypeToValueMapper): GeneratedValue | GeneratedValueArray =>
    isArray(value) ? wrapWithArrray(value[0]).map(mapper) : mapper(value);

export const schemaToPrototype = (
  json: SchemaToPrototypeProps
): Observable<[string, ValueGenerator]> =>
  from(Object.entries(json)).pipe(
    map(([key, value]: [string, CustomType]): [string, ValueGenerator] => [
      key,
      parseArray(value),
    ])
  );
