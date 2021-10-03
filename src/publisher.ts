import { interval, tap, mergeMap, Observable } from 'rxjs';
import amqp from 'amqplib';
import { parseSchema } from './utils/parse-schema';
import { ParsedSchema, Schema } from './types';

type propNames = {
  channel: amqp.Channel;
  publishQueueName: string;
  schema: Observable<Schema>;
  intervalMillis: number;
};

export const getPublisher = ({
  channel,
  publishQueueName,
  schema,
  intervalMillis,
}: propNames): Observable<ParsedSchema> =>
  interval(intervalMillis).pipe(
    mergeMap(__ => schema.pipe(mergeMap(parseSchema))),
    tap(message =>
      channel.sendToQueue(
        publishQueueName,
        Buffer.from(JSON.stringify(message))
      )
    )
  );
