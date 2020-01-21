import { Promise } from 'bluebird'
import * as request from 'request-promise'
import { GatewayApp } from '@au/gateway/src/gateway'
import { AuthApp } from '@au/auth/src/auth'
import { CollectorApp } from '@au/collector/src/collector'
import * as jwt from 'jsonwebtoken'
import { reset } from '../../../tests/helpers/clickhouse'

import { omit } from 'lodash'
import * as AMQPTransport from '@microfleet/transport-amqp'
import { config } from '@au/gateway/src/configs'

const getTransport = amqpConfig => {
  return AMQPTransport.connect(amqpConfig).disposer(amqp => amqp.close())
}

const amqpConfig = omit(config.amqp.transport, [
  'queue',
  'neck',
  'listen',
  'onComplete',
])

describe('gateway service', () => {
  test('should be able to start', async () => {
    const gateway = new GatewayApp()
    await gateway.connect()
    await gateway.close()
  })
})

describe('gateway', () => {
  const authApp = new AuthApp()
  const collectorApp = new CollectorApp()
  const gatewayApp = new GatewayApp()

  beforeAll(async () => {
    await authApp.connect()
    await collectorApp.connect()

    await reset(collectorApp.clickhouse)
    collectorApp.migrate('clickhouse')

    await gatewayApp.connect()
  })

  afterAll(async () => {
    await authApp.close()
    await collectorApp.close()
    await gatewayApp.close()
  })

  test('should be send user log with auth token', done => {
    const options = {
      json: true,
      method: 'POST',
      resolveWithFullResponse: true,
      simple: false,
      uri: 'http://localhost:3000/gateway/user/log/add',
      headers: { 'x-slr-token': 'leroy:admin' },
      body: {
        client_id: 123,
        overlay_open: 'ovop_1',
        overlay_type: 'ov_type_test',
        device: 'device_1',
      },
    }

    request(options).then(response => {
      expect(response.body).toMatchObject({ result: 'ok' })
      done()
    })
  })

  test('should be not send user log without token', done => {
    const options = {
      json: true,
      method: 'POST',
      resolveWithFullResponse: true,
      simple: false,
      uri: 'http://localhost:3000/gateway/user/log/add',
      body: {
        client_id: 123,
        overlay_open: 'op_1',
        overlay_type: 'ov_type_1',
        device: 'device_1',
      },
    }

    request(options).then(response => {
      expect(response.body).toMatchObject({
        statusCode: 401,
        error: 'Unauthorized',
        message:
          'An attempt was made to perform an operation without authentication: Credentials Required',
      })
      done()
    })
  })

  test('should be send user log by amqp', async () => {
    const result = await Promise.using(
      getTransport(amqpConfig),
      (amqp: any) => {
        return amqp.publishAndWait('gateway.user.log.add', {
          client_id: 123,
          overlay_open: 'ovop_1',
          overlay_type: 'ov_type_1',
          device: 'device_1',
        })
      },
    )

    expect(result).toMatchObject({ result: 'ok' })
  })

  test('should be get user logs', async () => {
    const token = jwt.sign({ name: 'leroy', role: 'admin' }, 'jwt-secret')
    const options = {
      json: true,
      method: 'POST',
      resolveWithFullResponse: true,
      simple: false,
      uri: 'http://localhost:3000/gateway/user/log/statistics',
      headers: { authorization: `Bearer ${token}` },
      body: {
        type: 'countOpenByPeriod',
        options: {
          periodType: 'Hour',
          overlayType: 'ot_1',
          from: '2019-01-01 00:00:00',
          to: '2020-12-01 23:59:59',
        },
      },
    }

    const response = await request(options)
    expect(response.body.sort()).toMatchObject(
      [{ HourPeriod: 0, count_open: 21 }].sort(),
    )
  })
})
