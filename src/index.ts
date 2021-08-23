import { getChannel } from './channel';
import { getPublisher } from './publisher';
import { getEnv } from './utils/get-env';
import dotenv from 'dotenv';
import { schemas } from './schemas';

dotenv.config();

const config = {
  connectionUri: getEnv('RABBIT_URI'),
  queueName: getEnv('QUEUE'),
  schema: schemas[getEnv('SCHEMA')],
  intervalMillis: parseInt(getEnv('INTERVAL')),
};

const main = async () => {
  const { connectionUri, queueName, schema, intervalMillis } = config;
  const channel = await getChannel({
    connectionUri,
    queueName,
  });
  const publisher = await getPublisher({
    channel,
    queueName,
    schema,
    intervalMillis,
  });
  publisher.subscribe(console.log);
};

main();
