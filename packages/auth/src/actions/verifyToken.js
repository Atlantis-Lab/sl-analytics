const { ActionTransport } = require('@microfleet/core')
const { HttpStatusError } = require('common-errors')

function decodeToken(token) {
  const [name, role] = token.split(':', 2)
  return { name, role }
}

function verifyToken({ params }) {
  const { token } = params

  const { name, role } = decodeToken(token)

  if (!name || !role) {
    throw new HttpStatusError(403, 'Invalid token')
  }

  return { name, role }
}

verifyToken.transports = [ActionTransport.amqp]

module.exports = verifyToken
