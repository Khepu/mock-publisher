import { getChannel } from './channel';
import { getPublisher } from './publisher';
import { getEnv } from './utils/get-env';
import dotenv from 'dotenv';
import { agentRequestSchema } from './schemas/agent-request';

dotenv.config();

const config = {
  connectionUri: getEnv('RABBIT_URI'),
  queueName: getEnv('QUEUE'),
  schema: agentRequestSchema,
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
