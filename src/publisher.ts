import {
  interval,
  tap,
  mergeMap,
  Observable,
  from,
  takeUntil,
  takeWhile,
} from 'rxjs';
import amqp from 'amqplib';
import { parseSchema } from './utils/parse-schema';
import { ParsedSchema, Schema } from './types';
import { just, StreamEnd } from './utils/helpers';

type propNames = {
  channel: amqp.Channel;
  publishQueueName: string;
  schema: Observable<Schema[] | Schema>;
  intervalMillis: number;
};

export const getPublisher = ({
  channel,
  publishQueueName,
  schema,
  intervalMillis,
}: propNames): Observable<ParsedSchema | StreamEnd> =>
  interval(intervalMillis).pipe(
    mergeMap((num) =>
      schema.pipe(
        mergeMap((a) => {
          if (Array.isArray(a)) {
            return a[num] ? parseSchema(a[num]) : just(new StreamEnd());
          } else {
            return parseSchema(a);
          }
        })
      )
    ),
    takeWhile((message) => !(message instanceof StreamEnd)),
    tap((message) =>
      channel.sendToQueue(
        publishQueueName,
        Buffer.from(JSON.stringify(message))
      )
    )
  );
