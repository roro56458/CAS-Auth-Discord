#!/bin/bash

echo "Starting Redis..."
redis-server /etc/redis/redis.conf &
REDIS_PID=$!

if ps -p $REDIS_PID > /dev/null; then
    echo "Redis started successfully with PID $REDIS_PID."
else
    echo "Failed to start Redis."
    exit 1
fi

echo "Starting Node.js application..."
cd /app
npm start
