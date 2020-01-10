const { HttpStatusError } = require('common-errors')
const Promise = require('bluebird')
const { amqp } = require('@au/common')
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

async function xSlrToken(request) {
  const { prefix } = config.router.routes
  const { action } = request
  const { auth } = action
  const { strategy = 'required' } = auth
  const route = `${prefix}.verifySlrToken`
  const xSlrToken = request.headers['x-slr-token']

  if (strategy === 'required' && !xSlrToken) {
    throw new HttpStatusError(401, 'Credentials Required')
  }

  const payload = {
    token: xSlrToken,
  }

  return Promise.using(amqp.getTransport(amqpConfig), amqp => {
    return amqp.publishAndWait(route, payload)
  })
}

module.exports = xSlrToken
