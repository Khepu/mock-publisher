import {
  from,
  lastValueFrom,
  map,
  mergeMap,
  NotFoundError,
  ObjectUnsubscribedError,
  range,
  tap,
} from 'rxjs';
import {
  CustomValueType,
  GeneratedValue,
  GeneratedValueArray,
  ParsedSchema,
  Schema,
  SchemaTypes,
  ArrayValue,
  StaticValue,
} from '../types';
import { getRange, just } from '../utils/helpers';
import { parseSchema } from '../utils/parse-schema';
import _ from 'lodash';

const schema = {
  id: { type: CustomValueType.UUID },
  createdAt: { type: CustomValueType.TIMESTAMP },
  numAr: {
    type: ArrayValue,
    of: CustomValueType.INT,
    dimensions: 4,
    lengths: [3, 2, 5, 2],
  },
  staticNumAr: {
    type: StaticValue,
    value: [
      [[1], [2]],
      [[3], [4]],
    ],
  },
  someFloat: { type: CustomValueType.FLOAT },
  someString: { type: CustomValueType.STRING },
};

const isValidUUID = (genValue: any) =>
  typeof genValue === 'string' &&
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    genValue
  );

const isValidArray = (genValue: any) => Array.isArray(genValue);

const isValidInt = (genValue: any) =>
  typeof genValue === 'number' && genValue >= 1 && genValue <= 100;

const isValidFloat = (genValue: any) =>
  typeof genValue === 'number' && genValue >= -1 && genValue <= 1;

const isValidTimestamp = (genValue: any) => genValue instanceof Date;

const isValidString = (genValue: any) => typeof genValue === 'string';

test('Test validity of parsed schema', () =>
  lastValueFrom(parseSchema(schema)).then((data) => {
    expect(Boolean(isValidUUID(data.id))).toBe(true);
    expect(Boolean(isValidTimestamp(data.createdAt))).toBe(true);
    expect(Boolean(_.isEqual(schema.staticNumAr.value, data.staticNumAr))).toBe(
      true
    );
    expect(Boolean(isValidFloat(data.someFloat))).toBe(true);
    expect(Boolean(isValidString(data.someString))).toBe(true);

    if (Array.isArray(data.numAr)) {
      expect(Boolean(isValidArray(data.numAr))).toBe(true);
      expect(Boolean(data.numAr.length === 3)).toBe(true);

      if (Array.isArray(data.numAr[0])) {
        expect(Boolean(isValidArray(data.numAr[0]))).toBe(true);
        expect(Boolean(data.numAr[0].length === 2)).toBe(true);

        if (Array.isArray(data.numAr[0][0])) {
          expect(Boolean(isValidArray(data.numAr[1]))).toBe(true);
          expect(Boolean(data.numAr[0][0].length === 5)).toBe(true);

          if (Array.isArray(data.numAr[0][0][0])) {
            expect(Boolean(isValidArray(data.numAr[1]))).toBe(true);
            expect(Boolean(data.numAr[0][0][0].length === 2)).toBe(true);
          }
        }
      }
    }
  }));

const invalidSchema1 = {
  numAr: {
    type: ArrayValue,
    of: CustomValueType.INT,
    dimensions: 5,
    lengths: [3, 2, 5, 2],
  },
};

const invalidSchema2 = {
  some: { a: CustomValueType.INT },
};

const invalidSchema3 = {
  some: { type: 'double' },
};

const invalidSchema4 = [1, 2, 3, 4];

test('Test invalid schema1', () => {
  expect.assertions(1);
  return lastValueFrom(parseSchema(invalidSchema1)).catch((err) =>
    expect(err).toBeInstanceOf(Error)
  );
});

test('Test invalid schema2', () => {
  expect.assertions(1);
  return lastValueFrom(parseSchema(invalidSchema2 as unknown as Schema)).catch(
    (err) => expect(err).toBeInstanceOf(Error)
  );
});

test('Test invalid schema3', () => {
  expect.assertions(1);
  return lastValueFrom(parseSchema(invalidSchema3 as unknown as Schema)).catch(
    (err) => expect(err).toBeInstanceOf(Error)
  );
});

test('Test invalid schema4', () => {
  expect.assertions(1);
  return lastValueFrom(parseSchema(invalidSchema4 as unknown as Schema)).catch(
    (err) => expect(err).toBeInstanceOf(Error)
  );
});
