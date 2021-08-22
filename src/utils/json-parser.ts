import { v4 as uuidv4 } from 'uuid';
import { range, map, from, reduce } from 'rxjs';

export enum CustomType {
  TIMESTAMP = 'timestamp',
  UUID = 'uuid',
  NUMBER = 'number',
  STRING = 'string',
}

type JsonParserProps = { [key: string]: CustomType | CustomType[] };

const isArray = Array.isArray;

const randomNum = (start: number, end: number) =>
  Math.floor(Math.random() * end) + start;

const randomLengthArray = (start: number, end: number) =>
  new Array(randomNum(start, end));

const randomString = () => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'.split('');

  return randomLengthArray(10, 20)
    .fill(0)
    .map(_ => chars[randomNum(1, chars.length)])
    .join('');
};

const parseValue = (type: CustomType): string | number | Date => {
  switch (type) {
    case CustomType.NUMBER:
      return randomNum(1, 100);
    case CustomType.UUID:
      return uuidv4();
    case CustomType.TIMESTAMP:
      return new Date(Date.now());
    case CustomType.STRING:
      return randomString();
  }
};

const wrapWithArrray =
  (type: CustomType) =>
  (mapper: (type: CustomType) => string | Date | number) =>
    randomLengthArray(1, 10).fill(type).map(mapper);

const parseValueInterm = (value: CustomType | CustomType[]) => {
  if (isArray(value)) {
    return wrapWithArrray(value[0])(parseValue);
  } else {
    return parseValue(value);
  }
};

export const jsonParser = (json: JsonParserProps) =>
  Object.entries(json).reduce(
    (acc, [key, value]: [string, CustomType | CustomType[]]) => {
      return { ...acc, [key]: parseValueInterm(value) };
    },
    {}
  );
