const {
  HttpStatusError,
  AuthenticationRequiredError,
} = require('common-errors')
const Promise = require('bluebird')
const { amqp } = require('@au/common')
const omit = require('lodash/omit')

const config = require('../../config').get('/', {
  env: process.env.NODE_ENV,
})

const amqpConfig = omit(config.amqp.transport, [
  'queue',
  'neck',
  'listen',
  'onComplete',
])

function getAuthToken(authHeader) {
  const [auth, token] = authHeader
    .trim()
    .split(/\s+/, 2)
    .map(str => str.trim())

  if (!auth || !token) {
    throw new AuthenticationRequiredError('Invalid token')
  }

  return token
}

async function jwtToken(request) {
  const { prefix } = config.router.routes
  const { action } = request
  const { auth } = action
  const { strategy = 'required' } = auth
  const route = `${prefix}.verifyJwtToken`
  const authorization = request.headers.authorization
  const token = getAuthToken(authorization)

  if (strategy === 'required' && !authorization) {
    throw new HttpStatusError(401, 'Credentials Required')
  }

  const payload = {
    token,
  }

  return Promise.using(amqp.getTransport(amqpConfig), amqp => {
    return amqp.publishAndWait(route, payload)
  })
}

module.exports = jwtToken
