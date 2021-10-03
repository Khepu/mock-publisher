import { Channel, Connection, connect } from 'amqplib';

import { mergeMap, from, Observable, tap } from 'rxjs';

export const getChannel = (
  connectionUri: string,
  queueName: string
): Observable<Channel> =>
  from(connect(connectionUri)).pipe(
    mergeMap((connection: Connection) => from(connection.createChannel()))
  );
