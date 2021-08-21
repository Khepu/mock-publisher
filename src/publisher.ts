import { interval, map, tap } from 'rxjs';
import amqp from 'amqplib';

type propNames = {
  channel: amqp.Channel;
  queueName: string;
  messagePrototype: { [key: string]: unknown };
  intervalMillis: number;
};

export const getPublisher = async ({
  channel,
  queueName,
  messagePrototype,
  intervalMillis,
}: propNames) =>
  interval(intervalMillis)
    .pipe(map(num => ({ ...messagePrototype, count: num })))
    .pipe(
      tap(message =>
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
      )
    );
