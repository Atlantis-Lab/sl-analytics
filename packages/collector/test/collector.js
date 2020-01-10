const Promise = require('bluebird')
const Collector = require('../src')
const { amqp } = require('@au/common')
const omit = require('lodash/omit')
const chaiSubset = require('chai-subset')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')
const { expect } = require('chai')
  .use(chaiSubset)
  .use(deepEqualInAnyOrder)
const {
  sampleUserLogsData,
  clickhouse,
  cleanUserLogsTable,
} = require('../../../test/helpers/clickhouse')

const amqpConfig = omit(
  require('@au/collector/src/configs/amqp').amqp.transport,
  ['queue', 'neck', 'listen', 'onComplete'],
)

describe('collector service', () => {
  it('should be able to start', async () => {
    const collector = new Collector()
    await collector.connect()
    await collector.close()
  })
})

describe('collector', () => {
  const collector = new Collector()
  before('init collector', async () => {
    await collector.connect()
    await sampleUserLogsData(collector.clickhouse)
  })

  it('should be send user log', async () => {
    const payload = {
      client_id: 122192,
      overlay_open: 'overlay_open_1',
      overlay_type: 'overlay_type_1',
      device: 'device_1',
    }

    await Promise.using(amqp.getTransport(amqpConfig), amqp => {
      return amqp.publishAndWait('au.insertData', payload)
    })

    const ch = collector.clickhouse
    const result = await ch
      .query('SELECT * FROM au_test.user_logs WHERE client_id = 122192')
      .toPromise()

    expect(result[0]).to.containSubset(payload)
  })

  it('should be get count by period', async () => {
    const resultByMinute = await Promise.using(
      amqp.getTransport(amqpConfig),
      amqp => {
        return amqp.publishAndWait('au.getData', {
          type: 'countOpenByPeriod',
          options: {
            periodType: 'Minute',
            overlayType: 'ot_1',
            from: '2019-01-01 00:00:00',
            to: '2019-10-01 23:59:59',
          },
        })
      },
    )

    const resultByMonth = await Promise.using(
      amqp.getTransport(amqpConfig),
      amqp => {
        return amqp.publishAndWait('au.getData', {
          type: 'countOpenByPeriod',
          options: {
            periodType: 'Month',
            overlayType: 'ot_1',
            from: '2019-01-01 00:00:00',
            to: '2019-04-01 00:00:00',
          },
        })
      },
    )

    expect(resultByMinute).to.deep.equalInAnyOrder([
      { MinutePeriod: 0, count_open: 15 },
      { MinutePeriod: 3, count_open: 3 },
      { MinutePeriod: 2, count_open: 2 },
      { MinutePeriod: 1, count_open: 1 },
    ])

    expect(resultByMonth).to.deep.equalInAnyOrder([
      { MonthPeriod: 1, count_open: 14 },
      { MonthPeriod: 2, count_open: 1 },
      { MonthPeriod: 3, count_open: 1 },
    ])
  })

  it('should be get popular device', async () => {
    const result = await Promise.using(amqp.getTransport(amqpConfig), amqp => {
      return amqp.publishAndWait('au.getData', {
        type: 'devicePopular',
        options: {
          from: '2019-01-01 00:00:00',
          to: '2019-10-01 23:59:59',
        },
      })
    })

    expect(result).to.deep.equalInAnyOrder([
      { device: 'd_1', count_device: 15 },
      { device: 'd_2', count_device: 6 },
      { device: 'd_3', count_device: 6 },
    ])
  })

  it('should be get popular overlay by device', async () => {
    const result = await Promise.using(amqp.getTransport(amqpConfig), amqp => {
      return amqp.publishAndWait('au.getData', {
        type: 'popularOverlayByDevice',
        options: {
          device: 'd_1',
          from: '2019-01-01 00:00:00',
          to: '2019-10-01 23:59:59',
        },
      })
    })

    expect(result).to.deep.equalInAnyOrder([
      { overlay_type: 'ot_1', count_overlay: 9 },
      { overlay_type: 'ot_2', count_overlay: 3 },
      { overlay_type: 'ot_3', count_overlay: 3 },
    ])
  })

  after('stop collector', async () => {
    await cleanUserLogsTable(clickhouse)
    collector.close()
  })
})
