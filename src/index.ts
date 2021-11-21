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
import * as promClient from 'prom-client';

import { mergeMap, from, tap } from 'rxjs';

const main = async () => {
  dotenv.config();

  const rabbitUser = getEnv('RABBIT_USER', false, 'guest');
  const rabbitPass = getEnv('RABBIT_PASS', false, 'guest');
  const rabbitHost = getEnv('RABBIT_HOST', false, 'localhost');
  const rabbitPort = getEnv('RABBIT_PORT', false, '5672');

  const nodePort = getEnv('NODE_PORT', false, '5000');

  const config: Configuration = {
    connectionUri: `amqp://${rabbitUser}:${rabbitPass}@${rabbitHost}:${rabbitPort}`,
    publishQueueName: getEnv('RABBIT_PUBLISH_QUEUE'),
    consumeQueueName: getEnv('RABBIT_CONSUME_QUEUE'),
    schema: getSchema(),
    intervalMillis: parseInt(getEnv('INTERVAL', false, '1000')),
    isEnvironmentInstance: parseBoolean(getEnv('IS_INSTANCE', true, 'false')),
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
      tap((channel) => channel.assertQueue(publishQueueName)),
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
      error: (err) => console.log(`Error_${err}`),
      complete: () => console.log('Ran out of elements, closing stream'),
    });

  from(channel)
    .pipe(
      tap((channel) => channel.assertQueue(consumeQueueName)),
      tap((channel) =>
        channel
          .consume(consumeQueueName, (msg) => {
            console.log('Received Message__', msg?.content.toString());
          })
          .catch((err) => console.log(`Error_${err}`))
      )
    )
    .subscribe();

  const collectDefaultMetrics = promClient.collectDefaultMetrics;
  collectDefaultMetrics();
  //
  const app = express();

  app.get('/health', async (req, res) => {
    console.log('Received a health check request');
    res.sendStatus(200);
  });

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.send(metrics);
  });

  app.listen(nodePort, () => console.log(`Listening to port ${nodePort}`));
};

main();
