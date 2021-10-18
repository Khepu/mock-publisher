import { Observable } from 'rxjs';

export const isArray = Array.isArray;

export const randomNum = (start: number, end: number): number =>
  Math.floor(Math.random() * end) + start;

export const randomFloat = (start: number, end: number): number =>
  Math.random() * end + start;

export const randomLengthArray = (start: number, end: number): number[] =>
  new Array(randomNum(start, end));

export const randomString = (start: number, end: number) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'.split('');

  return randomLengthArray(start, end)
    .fill(0)
    .map(_ => chars[randomNum(1, chars.length)])
    .join('');
};

export const just = <T>(val: T): Observable<T> =>
  new Observable(subscriber => subscriber.next(val));

export const parseBoolean = (str: string): boolean => {
  switch (str.toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
    case '':
      return false;
    default:
      throw new Error('Invalid boolean string');
  }
};

export class StreamEnd {}
