import { HttpStatusError } from 'common-errors'

export async function xSlrToken(request) {
  const { transport } = request
  const amqp = this.amqp

  if (transport !== 'http') {
    return
  }

  const { action } = request
  const { auth } = action
  const { strategy = 'required' } = auth
  const route = `auth.token.slr.verify`
  const xSlrToken = request.headers['x-slr-token']

  if (strategy === 'required' && !xSlrToken) {
    throw new HttpStatusError(401, 'Credentials Required')
  }

  const payload = {
    token: xSlrToken,
  }

  return await amqp.publishAndWait(route, payload)
}
