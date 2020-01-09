const { ActionTransport } = require('@microfleet/core')
const Promise = require('bluebird')
const { amqp } = require('@microfleet/common')
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

async function create({ params }) {
  const { client_id, overlay_open, overlay_type, device } = params
  const { prefix } = config.router.routes
  const route = `${prefix}.insertData`

  const payload = {
    client_id,
    overlay_open,
    overlay_type,
    device,
  }

  await Promise.using(amqp.getTransport(amqpConfig), amqp => {
    return amqp.publishAndWait(route, payload)
  })

  return { result: 'ok' }
}

create.transports = [ActionTransport.amqp, ActionTransport.http]
create.auth = {
  name: 'xSlrToken',
}

module.exports = create
