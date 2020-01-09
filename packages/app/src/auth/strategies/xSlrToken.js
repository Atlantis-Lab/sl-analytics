const { HttpStatusError } = require('common-errors')
const Promise = require('bluebird')
const AMQPTransport = require('@microfleet/transport-amqp')
const omit = require('lodash/omit')

const config = require('../../config').get('/', {
  env: process.env.NODE_ENV,
})

const amqpConfig = omit(config.amqp.transport, [
  'queue',
  'neck',
  'listen',
  'onComplete',
])

const getTransport = () => {
  return AMQPTransport.connect(amqpConfig).disposer(amqp => amqp.close())
}

async function xSlrToken(request) {
  const { prefix } = config.router.routes
  const { action } = request
  const { auth } = action
  const { strategy = 'required' } = auth
  const route = `${prefix}.verifyToken`
  const xSlrToken = request.headers['x-slr-token']

  if (strategy === 'required' && !xSlrToken) {
    throw new HttpStatusError(401, 'Credentials Required')
  }

  const payload = {
    token: xSlrToken,
  }

  return Promise.using(getTransport(), amqp => {
    return amqp.publishAndWait(route, payload)
  })
}

module.exports = xSlrToken
