import amqp from 'amqplib';
import { delay, from, Observable, range, tap } from 'rxjs';

const main = async () => {
  const connection = await amqp.connect('amqp://localhost:5672');

  const channel = await connection.createChannel();

  channel.assertQueue('Hello');

  range(1, 5)
    .pipe(tap(message => channel.sendToQueue('Hello', Buffer.from('ASDASDSD'))))
    .subscribe({
      next: value => {
        console.log(value);
      },
      complete: () => {
        console.log('Complete!');
      },
    });
};

main();
