exports.amqp = {
  transport: {
    queue: 'au-gateway',
    neck: 5,
    bindPersistantQueueToHeadersExchange: true,
    connection: {
      host: 'rabbitmq',
    },
  },
  router: {
    enabled: true,
  },
}
