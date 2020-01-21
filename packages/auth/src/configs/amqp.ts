export const amqp = {
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
