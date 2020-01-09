exports.amqp = {
  transport: {
    queue: 'au-auth',
    connection: {
      host: 'rabbitmq',
    },
  },
  router: {
    enabled: true,
  },
}
