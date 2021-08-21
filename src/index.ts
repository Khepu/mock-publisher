import { getChannel } from './channel';
import { getPublisher } from './publisher';

const config = {
  connectionUri: 'amqp://localhost:5672',
  queueName: 'helloo',
  messagePrototype: {
    asd: 'asdasdsda',
    asd2: 'asasadssasad',
  },
  intervalMillis: 200,
};

const main = async () => {
  const { connectionUri, queueName, messagePrototype, intervalMillis } = config;

  const channel = await getChannel({
    connectionUri,
    queueName,
  });

  const publisher = await getPublisher({
    channel,
    queueName,
    messagePrototype,
    intervalMillis,
  });

  publisher.subscribe({ next: console.log });
};

main();
