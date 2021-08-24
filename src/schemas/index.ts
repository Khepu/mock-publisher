import { Schema } from '../types';
import { promises } from 'fs';
import { catchError, EMPTY, from, map, Observable, of } from 'rxjs';
import { join } from 'path';

const readFile = promises.readFile;

export const getSchema = (schemaName: string): Observable<Schema> => {
  return from(readFile(join(__dirname, `${schemaName}.json`))).pipe(
    map((buffer: Buffer) => buffer.toString()),
    map(bufferString => JSON.parse(bufferString))
  );
};
