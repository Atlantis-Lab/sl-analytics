import { AuthApp } from '@au/auth'
import * as jwt from 'jsonwebtoken'
import { omit } from 'lodash'
import { Promise } from 'bluebird'
import * as AMQPTransport from '@microfleet/transport-amqp'
import { config } from '@au/auth/src/configs'

const getTransport = amqpConfig => {
  return AMQPTransport.connect(amqpConfig).disposer(amqp => amqp.close())
}

const amqpConfig = omit(config.amqp.transport, [
  'queue',
  'neck',
  'listen',
  'onComplete',
])

const auth = new AuthApp({ jwt: { secret: 'jwt-secret' } })

describe('init auth service', () => {
  test('should be able to start', done => {
    const auth = new AuthApp()
    auth.connect().then(() => auth.close().then(() => done()))
  })
})

describe('auth service', () => {
  beforeAll(async () => {
    await auth.connect()
  })

  afterAll(async () => {
    await auth.close()
  })

  test('should be verify x-slr-token', async () => {
    const data = await Promise.using(getTransport(amqpConfig), (amqp: any) => {
      return amqp.publishAndWait('auth.token.slr.verify', {
        token: 'bob:admin',
      })
    })

    expect(data).toMatchObject({ name: 'bob', role: 'admin' })
  })

  test('should be not verify x-slr-token', async () => {
    try {
      await Promise.using(getTransport(amqpConfig), (amqp: any) => {
        return amqp.publishAndWait('auth.token.slr.verify', {
          token: 'bob-admin',
        })
      })
    } catch (err) {
      expect(err).toMatchObject({ status: 403, message: 'Invalid token' })
    }
  })

  test('should be verify jwt token', async () => {
    const token = jwt.sign({ name: 'leroy', role: 'admin' }, 'jwt-secret')

    const data = await Promise.using(getTransport(amqpConfig), (amqp: any) => {
      return amqp.publishAndWait('auth.token.jwt.verify', { token })
    })

    expect(data).toMatchObject({ name: 'leroy', role: 'admin' })
  })

  test('should be not verify jwt token', async () => {
    const token = jwt.sign({ name: 'leroy', role: 'admin' }, 'jwt-wrong-secret')

    try {
      await Promise.using(getTransport(amqpConfig), (amqp: any) => {
        return amqp.publishAndWait('auth.token.jwt.verify', { token })
      })
    } catch (err) {
      expect(err).toMatchObject({ status: 403, message: 'Invalid token' })
    }
  })
})
