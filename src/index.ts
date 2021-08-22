import { getChannel } from './channel';
import { getPublisher } from './publisher';
import { getEnv } from './utils/get-env';
import dotenv from 'dotenv';
import { CustomType, jsonParser } from './utils/json-parser';

dotenv.config();

const config = {
  connectionUri: getEnv('RABBIT_URI'),
  queueName: getEnv('QUEUE'),
  messagePrototype: getEnv('MESSAGE'),
  intervalMillis: parseInt(getEnv('INTERVAL')),
};

const jason = {
  createdAt: CustomType.TIMESTAMP,
  id: CustomType.UUID,
  numAr: [CustomType.NUMBER],
  numStr: CustomType.STRING,
};

const main = async () => {
  console.log(jsonParser(jason));

  // const { connectionUri, queueName, messagePrototype, intervalMillis } = config;

  // const channel = await getChannel({
  //   connectionUri,
  //   queueName,
  // });

  // const publisher = await getPublisher({
  //   channel,
  //   queueName,
  //   messagePrototype,
  //   intervalMillis,
  // });

  // publisher.subscribe({ next: console.log });
};

main();
