import amqp from 'amqplib';

type channelProps = {
  connectionUri: string;
  queueName: string;
};

export const getChannel = async ({
  connectionUri,
  queueName,
}: channelProps): Promise<amqp.Channel> => {
  const connection = await amqp.connect(connectionUri);
  const channel = await connection.createChannel();
  channel.assertQueue(queueName);

  return channel;
};

//'amqp://localhost:5672'
//'Hello'
