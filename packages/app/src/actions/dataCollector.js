const { ActionTransport } = require('@microfleet/core')
const collectData = require('../utils/collectData')

function dataCollectorAction({ params }) {
  return collectData.call(this, params)
}

dataCollectorAction.transports = [ActionTransport.amqp, ActionTransport.http]

module.exports = dataCollectorAction
