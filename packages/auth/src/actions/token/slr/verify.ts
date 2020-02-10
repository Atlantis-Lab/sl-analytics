import { ActionTransport } from '@microfleet/core'
import { HttpStatusError } from 'common-errors'

function decodeToken(token) {
  const [name, role] = token.split(':', 2)
  return { name, role }
}

export default function verify({ params }) {
  const { token } = params

  const { name, role } = decodeToken(token)

  if (!name || !role) {
    throw new HttpStatusError(403, 'Invalid token')
  }

  return { name, role }
}

verify.transports = [ActionTransport.amqp]
