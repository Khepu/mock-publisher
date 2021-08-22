import { interval, map, tap, Observable, mergeMap } from 'rxjs';
import amqp from 'amqplib';
import { ValueGenerator } from './utils/util-types';
import { prototypeParser } from './utils/prototype-parser';

type propNames = {
  channel: amqp.Channel;
  queueName: string;
  messagePrototypeStream: Observable<[string, ValueGenerator]>;
  intervalMillis: number;
};

export const getPublisher = async ({
  channel,
  queueName,
  messagePrototypeStream,
  intervalMillis,
}: propNames) =>
  interval(intervalMillis).pipe(
    mergeMap(_ => prototypeParser(messagePrototypeStream)),
    tap(message =>
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
    )
  );
