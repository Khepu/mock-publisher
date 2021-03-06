#!/usr/bin/env sh

{
    echo "RABBIT_MQ_CONNECTION=amqp://${RABBIT_USER}:${RABBIT_PASS}@${RABBIT_HOST}:${RABBIT_PORT}/"
    echo "RABBIT_QUEUE=$RABBIT_QUEUE"
    echo "INTERVAL=$INTERVAL"
    echo "SCHEMA_PATH=$SCHEMA_PATH"

    echo "LOGGING_LEVEL=$LOGGING_LEVEL"
} > .env
