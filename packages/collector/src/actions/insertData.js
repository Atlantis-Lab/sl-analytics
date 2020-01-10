const { ActionTransport } = require('@microfleet/core')

const dbName = process.env.CH_DB_NAME || 'au'

async function insertData({ params }) {
  const ch = this.clickhouse
  const { client_id, overlay_open, overlay_type, device } = params

  const ws = ch.insert(`INSERT INTO ${dbName}.user_logs`).stream()
  await ws.writeRow([
    client_id,
    overlay_open,
    overlay_type,
    device,
    new Date().toISOString().split('T')[0],
    new Date(),
  ])

  return ws.exec()
}

insertData.transports = [ActionTransport.amqp]

module.exports = insertData
