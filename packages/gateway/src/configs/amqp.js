exports.amqp = {
  transport: {
    queue: 'au-microfleet',
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
