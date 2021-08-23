#!/bin/sh

cd /opt/draive/mock-publisher || exit

exec node build/index.js
