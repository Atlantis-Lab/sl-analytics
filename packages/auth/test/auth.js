const Promise = require('bluebird')
const Auth = require('../src')
const { amqp } = require('@au/common')
const omit = require('lodash/omit')
const chaiSubset = require('chai-subset')
const { assert, expect } = require('chai').use(chaiSubset)

const { jwtSign } = require('../../../test/helpers/jwt')

const config = require('../src/config').get('/', {
  env: process.env.NODE_ENV,
})

const jwtConfig = config.jwt

const amqpConfig = omit(config.amqp.transport, [
  'queue',
  'neck',
  'listen',
  'onComplete',
])

describe('auth service', () => {
  it('should be able to start', async () => {
    const auth = new Auth()
    await auth.connect()
    await auth.close()
  })
})

describe('auth', () => {
  const auth = new Auth()
  before('init auth', () => auth.connect())

  it('should be verify x-slr-token', async () => {
    const data = await Promise.using(amqp.getTransport(amqpConfig), amqp => {
      return amqp.publishAndWait('au.verifySlrToken', { token: 'bob:admin' })
    })

    assert.deepEqual(data, { name: 'bob', role: 'admin' })
  })

  it('should be verify jwt token', async () => {
    const token = jwtSign({ name: 'leroy', role: 'admin' }, jwtConfig.secret)
    const data = await Promise.using(amqp.getTransport(amqpConfig), amqp => {
      return amqp.publishAndWait('au.verifyJwtToken', { token })
    })

    expect(data).to.containSubset({ name: 'leroy', role: 'admin' })
  })

  it('should be not verify jwt token', async () => {
    const token = jwtSign({ name: 'leroy', role: 'admin' }, 'wrong_secret')

    try {
      await Promise.using(amqp.getTransport(amqpConfig), amqp => {
        return amqp.publishAndWait('au.verifyJwtToken', { token })
      })
    } catch (err) {
      expect(err).to.containSubset({ status: 403, message: 'Invalid token' })
    }
  })

  after('close auth', () => auth.close())
})
