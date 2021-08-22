export const isArray = Array.isArray;

export const randomNum = (start: number, end: number) =>
  Math.floor(Math.random() * end) + start;

export const randomFloat = (start: number, end: number) =>
  Math.round(Math.random() * end * 10000000) / 10000000;

export const randomLengthArray = (start: number, end: number) =>
  new Array(randomNum(start, end));

export const wrapWithArrray = <T>(value: T): T[] =>
  randomLengthArray(1, 10).fill(value);

export const randomString = () => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'.split('');

  return randomLengthArray(10, 20)
    .fill(0)
    .map(_ => chars[randomNum(1, chars.length)])
    .join('');
};
