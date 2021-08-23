import { Channel, Connection, connect } from 'amqplib';

import { from, Observable } from "rxjs";
import { flatMap, tap } from "rxjs/internal/operators";

export const getChannel = (
  connectionUri: string,
  queueName: string
): Observable<Channel> => from(connect(connectionUri))
    .pipe(
      flatMap((connection: Connection) => from(connection.createChannel())),
      tap((channel: Channel) => channel.assertQueue(queueName)));
