import { getChannel } from './channel';
import { getPublisher } from './publisher';
import { getEnv } from './utils/get-env';
import dotenv from 'dotenv';
import { getSchema } from './schemas';
import { validate } from './validation/configuration-validation';
import { parseBoolean } from './utils/helpers';
import { Configuration, ParsedSchema } from './types';
import { Channel } from 'amqplib';

import { flatMap, from, tap } from 'rxjs';

const main = async () => {
  dotenv.config();

  const config: Configuration = {
    connectionUri: getEnv('RABBIT_URI'),
    queueName: getEnv('RABBIT_QUEUE'),
    schema: getSchema(getEnv('SCHEMA')),
    intervalMillis: parseInt(getEnv('RABBIT_INTERVAL')),
    isEnvironmentInstance: parseBoolean(getEnv('IS_INSTANCE', true)),
    host: getEnv('HOST', true),
  };

  validate(config);

  const { connectionUri, queueName, schema, intervalMillis } = config;

  from(getChannel(connectionUri, queueName))
    .pipe(
      flatMap((channel: Channel) =>
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
