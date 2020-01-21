import { ActionTransport } from '@microfleet/core'
import { checkAdmin } from '../../../utils/checkRole'

export default async function statistics({ params }) {
  const { type, options } = params
  const route = `collector.user.log.get`
  const amqp = this.amqp
  const payload = { type, options }
  const data = await amqp.publishAndWait(route, payload)

  return data
}

statistics.allowed = checkAdmin
statistics.transports = [ActionTransport.http]
statistics.auth = {
  name: 'jwtToken',
}
