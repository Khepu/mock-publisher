import { getChannel } from './channel';
import { getPublisher } from './publisher';
import { getEnv } from './utils/get-env';
import dotenv from 'dotenv';
import { getSchema } from './schemas';
import { validate } from './validation/configuration-validation';
import { parseBoolean } from './utils/helpers';
import { Configuration } from './types';
import { Channel } from 'amqplib';
import express from 'express';

import { mergeMap, from, tap } from 'rxjs';

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
    publishQueueName: getEnv('RABBIT_PUBLISH_QUEUE'),
    consumeQueueName: getEnv('RABBIT_CONSUME_QUEUE'),
    schema: getSchema(getEnv('SCHEMA_PATH')),
    intervalMillis: parseInt(getEnv('INTERVAL')),
    isEnvironmentInstance: parseBoolean(getEnv('IS_INSTANCE', true)),
    host: getEnv('HOST', true),
  };

  validate(config);

  const {
    connectionUri,
    publishQueueName,
    consumeQueueName,
    schema,
    intervalMillis,
  } = config;

  const channel = getChannel(connectionUri, publishQueueName);

  from(channel)
    .pipe(
      tap(channel => channel.assertQueue(publishQueueName)),
      mergeMap((channel: Channel) =>
        from(
          getPublisher({
            channel,
            publishQueueName,
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

  from(channel)
    .pipe(
      tap(channel => channel.assertQueue(consumeQueueName)),
      tap(channel =>
        channel
          .consume(consumeQueueName, msg => {
            console.log('Received Message__', msg?.content.toString());
          })
          .catch(err => console.log(`Error_${err}`))
      )
    )
    .subscribe();

  const app = express();

  app.get('/health', async (req, res) => {
    res.sendStatus(200);
  });

  app.listen(5000);
};

main();
