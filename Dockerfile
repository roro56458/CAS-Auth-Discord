# Node.js part
FROM node:23 AS node-app
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build
EXPOSE 3000
# Redis part
RUN apt update && apt install -y \
    nano \
    iputils-ping \
    redis
COPY ./redis.conf /etc/redis/redis.conf
# Start script
COPY start.sh /start.sh
RUN chmod +x /start.sh
# Commande de démarrage
CMD ["bash", "/start.sh"]
