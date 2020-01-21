import { ActionTransport } from '@microfleet/core'
import { HttpStatusError } from 'common-errors'
import * as jwt from 'jsonwebtoken'

export default function verify({ params }: any) {
  const { token } = params
  const jwtConf = this.config.jwt

  try {
    const decoded = jwt.verify(token, jwtConf.secret)
    return decoded
  } catch (err) {
    throw new HttpStatusError(403, 'Invalid token')
  }
}

verify.transports = [ActionTransport.amqp]
