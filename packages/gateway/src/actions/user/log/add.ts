import { ActionTransport } from '@microfleet/core'

export default async function add({ params }) {
  const { client_id, overlay_open, overlay_type, device } = params
  const route = `collector.user.log.add`
  const amqp = this.amqp

  const payload = {
    client_id,
    overlay_open,
    overlay_type,
    device,
  }

  await amqp.publishAndWait(route, payload)

  return { result: 'ok' }
}

add.transports = [ActionTransport.amqp, ActionTransport.http]
add.auth = {
  name: 'xSlrToken',
}
