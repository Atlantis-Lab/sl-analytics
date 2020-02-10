export const amqp = {
  transport: {
    queue: 'au-gateway',
    connection: {
      host: 'rabbitmq',
    },
  },
  router: {
    enabled: true,
  },
}
