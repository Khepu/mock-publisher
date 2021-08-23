import { interval, tap, mergeMap, Observable } from 'rxjs';
import amqp from 'amqplib';
import { parseSchema } from './utils/parse-schema';
import { ParsedSchema, Schema } from './types';

type propNames = {
  channel: amqp.Channel;
  queueName: string;
  schema: Schema;
  intervalMillis: number;
};

export const getPublisher = ({
  channel,
  queueName,
  schema,
  intervalMillis,
}: propNames): Observable<ParsedSchema> =>
  interval(intervalMillis)
    .pipe(
      mergeMap(__ => parseSchema(schema)),
      tap(message => channel
        .sendToQueue(queueName, Buffer.from(JSON.stringify(message)))));
