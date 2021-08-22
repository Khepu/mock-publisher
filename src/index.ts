import { getChannel } from './channel';
import { getPublisher } from './publisher';
import { getEnv } from './utils/get-env';
import dotenv from 'dotenv';
import { schemaToPrototype } from './utils/schema-to-prototype';
import { CustomValueType } from './utils/util-types';

dotenv.config();

const jason = {
  id: CustomValueType.UUID,
  numAr: [CustomValueType.NUMBER],
  ranStr: CustomValueType.STRING,
  createdAt: CustomValueType.TIMESTAMP,
  ranFloat: CustomValueType.FLOAT,
};

const config = {
  connectionUri: getEnv('RABBIT_URI'),
  queueName: getEnv('QUEUE'),
  messagePrototypeStream: schemaToPrototype(jason),
  intervalMillis: parseInt(getEnv('INTERVAL')),
};

const main = async () => {
  const { connectionUri, queueName, messagePrototypeStream, intervalMillis } =
    config;

  const channel = await getChannel({
    connectionUri,
    queueName,
  });

  const publisher = await getPublisher({
    channel,
    queueName,
    messagePrototypeStream,
    intervalMillis,
  });

  publisher.subscribe(console.log);
};

main();
