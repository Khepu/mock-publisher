import { Schema } from '../types';
import { promises } from 'fs';
import { from, map, Observable } from 'rxjs';
import { join } from 'path';

const readFile = promises.readFile;

export const getSchema = (): Observable<Schema> =>
  from(readFile(join(__dirname, `schema.json`))).pipe(
    map((buffer: Buffer) => buffer.toString()),
    map(bufferString => JSON.parse(bufferString))
  );
