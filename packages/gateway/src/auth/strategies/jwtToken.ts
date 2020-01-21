import { HttpStatusError, AuthenticationRequiredError } from 'common-errors'

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

export async function jwtToken(request) {
  const { action } = request
  const { auth } = action
  const { strategy = 'required' } = auth
  const route = `auth.token.jwt.verify`
  const authorization = request.headers.authorization
  const token = getAuthToken(authorization)

  const amqp: any = this.amqp

  if (strategy === 'required' && !authorization) {
    throw new HttpStatusError(401, 'Credentials Required')
  }

  const payload = {
    token,
  }

  return amqp.publishAndWait(route, payload)
}
