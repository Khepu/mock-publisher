This repository is part of the "Draive" project (https://draive.gr/)

## Mock Publisher

A utility to aid in integration testing and stress testing other services that consume from and produce to rabbitmq queues. It publishes events with random values as described by a given schema at constant intervals at a predefined rabbitmq queue. It also consumes from a rabbitmq queue.

### Bulding the container

Run `docker build -t mock-publisher .` at the root directory.

### Running mock-publisher

**1. Define a schema**
A schema has the form of a JSON object with the keys specifying the names of the fields and the values being either constant values or specifications of the randomly generated values. 

For example, the schema: 
```
{
  "id": { "type": "uuid" },
  "createdAt": { "type": "timestamp" },
  "numAr": {
    "type": "array",
    "of": "int",
    "dimensions": 2,
    "lengths": [3, 2]
  },
  "predeterminedValue": { "type": "static", "value": 123 }
}
```

Could produce the following sample values:
```
{
  id: '12bc4423-5e5b-46c4-82dc-2d02d5403a34',
  createdAt: 2022-06-28T15:25:02.143Z,
  numAr: [ [ 32, 95 ], [ 69, 7 ], [ 17, 28 ] ],
  predeterminedValue: 123
}
{
  id: '34771614-cadc-4357-bc55-c0acdaef9a2a',
  createdAt: 2022-06-28T15:25:03.144Z,
  numAr: [ [ 83, 1 ], [ 52, 94 ], [ 59, 34 ] ],
  predeterminedValue: 123
}
{
  id: '73b89a88-762d-45e7-b093-bb9b8f42f835',
  createdAt: 2022-06-28T15:25:04.144Z,
  numAr: [ [ 94, 36 ], [ 32, 18 ], [ 58, 95 ] ],
  predeterminedValue: 123
}
```

**2. Run the container**
The following configuration shows an example usage.

```
docker run --network mock-net \
-v $PWD/schema.json:/opt/draive/mock-publisher/build/schemas/schema.json \
--name mock-publisher \
-e RABBIT_PUBLISH_QUEUE=queue1 \
-e RABBIT_CONSUME_QUEUE=queue2 \
-e RABBIT_USER=guest \
-e RABBIT_PASS=guest \
-e RABBIT_HOST=rabbit \
-e RABBIT_PORT=5672 \
-e SCHEMA_NAME=schema.json \
-e INTERVAL=1000 \
mock-publisher
```
