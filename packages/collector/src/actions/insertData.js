const { ActionTransport } = require('@microfleet/core')

function insertData({ params }) {
  const ch = this.clickhouse
  const { client_id, overlay_open, overlay_type, device } = params

  const stream = ch.query('INSERT INTO au.user_logs', {
    format: 'JSONEachRow',
  })

  stream.write({
    client_id,
    overlay_open,
    overlay_type,
    device,
    event_date: new Date().toISOString().split('T')[0],
    event_time: new Date(),
  })
  stream.end()
}

insertData.transports = [ActionTransport.amqp]

module.exports = insertData
