const { NotPermittedError } = require('common-errors')
const { ActionTransport } = require('@microfleet/core')
const Promise = require('bluebird')
const { amqp } = require('@au/common')
const omit = require('lodash/omit')
const { checkAdmin } = require('../../utils/checkRole')

const config = require('../../config').get('/', {
  env: process.env.NODE_ENV,
})

const amqpConfig = omit(config.amqp.transport, [
  'queue',
  'neck',
  'listen',
  'onComplete',
])

async function statistics({ params }) {
  const { type, options } = params

  const { prefix } = config.router.routes
  const route = `${prefix}.getData`

  const payload = { type, options }

  const data = await Promise.using(amqp.getTransport(amqpConfig), amqp => {
    return amqp.publishAndWait(route, payload)
  })

  return { result: data }
}

statistics.allowed = checkAdmin
statistics.transports = [ActionTransport.http]
statistics.auth = {
  name: 'jwtToken',
}

module.exports = statistics
