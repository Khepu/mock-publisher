import amqp from 'amqplib';
import { delay, from, Observable, range, tap } from 'rxjs';

const observable = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});

const main = async () => {
  const connection = await amqp.connect('amqp://localhost:5672');

  const channel = await connection.createChannel();

  channel.assertQueue('Hello');

  range(1, 10)
    .pipe(delay(100))
    .pipe(tap(message => channel.sendToQueue('Hello', Buffer.from('ASDASDSD'))))
    .subscribe();
};

main();
