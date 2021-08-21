import amqp from 'amqplib';
import { delay, from, interval, Observable, range, repeat, tap } from 'rxjs';
import { getChannel } from './channel';
import { getPublisher } from './publisher';

const config = {
  connectionUri: 'amqp://localhost:5672',
  queueName: 'Hello',
  messagePrototype: {
    asd: 'asdasdsda',
    asd2: 'asasadssasad',
  },
};

const main = async () => {
  const { connectionUri, queueName, messagePrototype } = config;

  const channel = await getChannel({
    connectionUri,
    queueName,
  });

  const publisher = await getPublisher({
    channel,
    queueName,
    messagePrototype,
  });

  publisher.subscribe({ next: console.log });
};

main();
