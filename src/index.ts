import { getChannel } from './channel';
import { getPublisher } from './publisher';
import { getEnv } from './utils/get-env';
import dotenv from 'dotenv';
import { getSchema } from './schemas';
import { validate } from './validation/configuration-validation';
import { parseBoolean } from './utils/helpers';
import { Configuration } from './types';
import { Channel } from 'amqplib';

import { mergeMap, from } from 'rxjs';

//"RABBIT_CONNECTION=amqp://${RABBIT_USER}:${RABBIT_PASS}@${RABBIT_HOST}:${RABBIT_PORT}/"

//"RABBIT_USER=$RABBIT_USER"
//"RABBIT_PASS=$RABBIT_PASS"
//"RABBIT_HOST=$RABBIT_HOST"
//"RABBIT_PORT=$RABBIT_PORT"

const main = async () => {
  dotenv.config();

  const rabbitUser = getEnv('RABBIT_USER');
  const rabbitPass = getEnv('RABBIT_PASS');
  const rabbitHost = getEnv('RABBIT_HOST');
  const rabbitPort = getEnv('RABBIT_PORT');

  const config: Configuration = {
    connectionUri: `amqp://${rabbitUser}:${rabbitPass}@${rabbitHost}:${rabbitPort}`,
    queueName: getEnv('RABBIT_QUEUE'),
    schema: getSchema(getEnv('SCHEMA_PATH')),
    intervalMillis: parseInt(getEnv('INTERVAL')),
    isEnvironmentInstance: parseBoolean(getEnv('IS_INSTANCE', true)),
    host: getEnv('HOST', true),
  };

  validate(config);

  const { connectionUri, queueName, schema, intervalMillis } = config;

  from(getChannel(connectionUri, queueName))
    .pipe(
      mergeMap((channel: Channel) =>
        from(
          getPublisher({
            channel,
            queueName,
            schema,
            intervalMillis,
          })
        )
      )
    )
    .subscribe({
      next: console.log,
      error: err => console.log(`Error_${err}`),
    });
};

main();
