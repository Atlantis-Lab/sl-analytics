export const amqp = {
  transport: {
    queue: 'au-collector',
    connection: {
      host: 'rabbitmq',
    },
  },
  router: {
    enabled: true,
  },
}
