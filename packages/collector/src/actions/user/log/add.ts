import { ActionTransport } from '@microfleet/core'

const dbName = process.env.CH_DB_NAME || 'au_test'

export default async function add({ params }) {
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

  await ws.exec()

  return { result: 'ok' }
}

add.transports = [ActionTransport.amqp]
