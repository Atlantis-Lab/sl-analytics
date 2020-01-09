const AMQPTransport = require('@microfleet/transport-amqp')

const getTransport = amqpConfig => {
  return AMQPTransport.connect(amqpConfig).disposer(amqp => amqp.close())
}

module.exports = getTransport
