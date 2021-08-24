import { Channel, Connection, connect } from 'amqplib';

import { flatMap, from, Observable, tap } from 'rxjs';

export const getChannel = (
  connectionUri: string,
  queueName: string
): Observable<Channel> =>
  from(connect(connectionUri)).pipe(
    flatMap((connection: Connection) => from(connection.createChannel())),
    tap((channel: Channel) => channel.assertQueue(queueName))
  );
