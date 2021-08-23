import { interval, tap, mergeMap } from 'rxjs';
import amqp from 'amqplib';
import { Schema } from './utils/util-types';
import { parseSchema } from './utils/parse-schema';

type propNames = {
  channel: amqp.Channel;
  queueName: string;
  schema: Schema;
  intervalMillis: number;
};

export const getPublisher = async ({
  channel,
  queueName,
  schema,
  intervalMillis,
}: propNames) =>
  interval(intervalMillis).pipe(
    mergeMap(_ => parseSchema(schema)),
    tap(message =>
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
    )
  );
