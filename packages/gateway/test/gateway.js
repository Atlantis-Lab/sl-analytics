const request = require('request-promise')
const Promise = require('bluebird')
const { amqp } = require('@au/common')
const chaiHttp = require('chai-http')
const chaiSubset = require('chai-subset')
const chai = require('chai')
chai.use(chaiHttp).use(chaiSubset)
const { clickhouse } = require('../../../test/helpers/clickhouse')

const { jwtSign } = require('../../../test/helpers/jwt')
const { jwt } = require('@au/auth/src/configs/jwt')

const { assert, expect } = chai

const amqpConfig = {
  bindPersistantQueueToHeadersExchange: true,
  connection: {
    host: 'rabbitmq',
  },
}

describe('gateway service', () => {
  it('should be able to start', async () => {
    const gateway = new (require('../../gateway/src'))()
    await gateway.connect()
    await gateway.close()
  })
})

describe('gateway', async () => {
  it('should be send user log with auth token', async () => {
    const options = {
      json: true,
      method: 'POST',
      resolveWithFullResponse: true,
      simple: false,
      uri: 'http://gateway:3000/au/user-logs/create',
      headers: { 'x-slr-token': 'leroy:admin' },
      body: {
        client_id: 123,
        overlay_open: 'ovop_1',
        overlay_type: 'ov_type_test',
        device: 'device_1',
      },
    }

    const response = await request(options)
    assert.deepEqual(response.body, { result: 'ok' })
  })

  it('should be not send user log without token', async () => {
    const options = {
      json: true,
      method: 'POST',
      resolveWithFullResponse: true,
      simple: false,
      uri: 'http://gateway:3000/au/user-logs/create',
      body: {
        client_id: 123,
        overlay_open: 'ovop_1',
        overlay_type: 'ov_type_1',
        device: 'device_1',
      },
    }

    const res = await request(options)
    expect(res.body).to.containSubset({
      statusCode: 401,
      error: 'Unauthorized',
      message:
        'An attempt was made to perform an operation without authentication: Credentials Required',
    })
  })

  it('should be send user log by amqp', async () => {
    const result = await Promise.using(amqp.getTransport(amqpConfig), amqp => {
      return amqp.publishAndWait('au.user-logs.create', {
        client_id: 123,
        overlay_open: 'ovop_1',
        overlay_type: 'ov_type_1',
        device: 'device_1',
      })
    })

    assert.deepEqual(result, { result: 'ok' })
  })

  it('should be get user logs', async () => {
    const token = jwtSign({ name: 'leroy', role: 'admin' }, jwt.secret)
    const options = {
      json: true,
      method: 'POST',
      resolveWithFullResponse: true,
      simple: false,
      uri: 'http://gateway:3000/au/user-logs/statistics',
      headers: { authorization: `Bearer ${token}` },
      body: {
        type: 'countOpenByPeriod',
        options: {
          periodType: 'Minute',
          overlayType: 'ov_type_test',
          from: '2019-01-01 00:00:00',
          to: '2020-12-01 23:59:59',
        },
      },
    }

    const response = await request(options)

    console.log(response.body)
  })
})
