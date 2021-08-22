import { getChannel } from './channel';
import { getPublisher } from './publisher';
import { getEnv } from './utils/get-env';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  connectionUri: getEnv('RABBIT_URI'),
  queueName: getEnv('QUEUE'),
  messagePrototype: getEnv('MESSAGE'),
  intervalMillis: parseInt(getEnv('INTERVAL')),
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
