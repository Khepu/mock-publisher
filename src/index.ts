import { getChannel } from './channel';
import { getPublisher } from './publisher';
import { getEnv } from './utils/get-env';
import dotenv from 'dotenv';
import { schemas } from './schemas';
import { validate } from './validation/configuration-validation';
import { parseBoolean } from './utils/helpers';
import { Configuration, ParsedSchema } from './types';
import { Channel } from 'amqplib';

import { from } from "rxjs";
import { flatMap, tap } from "rxjs/internal/operators";

const main = async () => {
  dotenv.config();

  const config: Configuration = {
    connectionUri: getEnv('RABBIT_URI'),
    queueName: getEnv('QUEUE'),
    schema: schemas[getEnv('SCHEMA')],
    intervalMillis: parseInt(getEnv('INTERVAL')),
    isEnvironmentInstance: parseBoolean(getEnv('IS_INSTANCE', true)),
    host: getEnv('HOST', true),
  };

  validate(config);

  const { connectionUri, queueName, schema, intervalMillis } = config;

  from(getChannel({ connectionUri, queueName, }))
    .pipe(
      flatMap((channel: Channel) => from(getPublisher({
        channel,
        queueName,
        schema,
        intervalMillis,
      }))),
      tap((parsedSchema: ParsedSchema) => console.log(parsedSchema)))
    .subscribe();
};

main();
