import { getChannel } from './channel';
import { getPublisher } from './publisher';
import { getEnv } from './utils/get-env';
import dotenv from 'dotenv';
import { schemas } from './schemas';
import { validate } from './validation/configuration-validation';
import { parseBoolean } from './utils/helpers';
import { Configuration } from './types';

dotenv.config();

const config: Configuration = {
  connectionUri: getEnv('RABBIT_URI'),
  queueName: getEnv('QUEUE'),
  schema: schemas[getEnv('SCHEMA')],
  intervalMillis: parseInt(getEnv('INTERVAL')),
  isEnvironmentInstance: parseBoolean(getEnv('IS_INSTANCE', true)),
  host: getEnv('HOST', true),
};

const main = async () => {
  validate(config);

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
