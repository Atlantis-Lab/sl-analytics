const { ActionTransport } = require('@microfleet/core')
const statistics = require('../utils/statistics')

function statisticsAction({ params }) {
  return statistics.call(this, params)
}

statisticsAction.transports = [ActionTransport.amqp, ActionTransport.http]

module.exports = statisticsAction
