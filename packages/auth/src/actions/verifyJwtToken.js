const { ActionTransport } = require('@microfleet/core')
const { HttpStatusError } = require('common-errors')
const jwt = require('jsonwebtoken')

async function verifyToken({ params }) {
  const { token } = params
  const jwtConf = this.config.jwt

  try {
    const decoded = jwt.verify(token, jwtConf.secret)
    return decoded
  } catch (err) {
    throw new HttpStatusError(403, 'Invalid token')
  }
}

verifyToken.transports = [ActionTransport.amqp]

module.exports = verifyToken
