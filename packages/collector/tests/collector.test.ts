import { CollectorApp, PeriodType } from '@au/collector'
import { reset } from '../../../tests/helpers/clickhouse'

describe('collector service', () => {
  test('should be able to start', async () => {
    const collector = new CollectorApp()
    await collector.connect()
    await collector.close()
  })
})

describe('collector', () => {
  const collector = new CollectorApp()

  beforeAll(async () => {
    await collector.connect()
    await reset(collector.clickhouse)
    collector.migrate('clickhouse')
  })

  afterAll(async () => {
    await collector.close()
  })

  test('should be send user log', async () => {
    const payload = {
      client_id: 122192,
      overlay_open: 'oo_1',
      overlay_type: 'ot_1',
      device: 'd_1',
    }
    const amqp = (collector as any).amqp
    await amqp.publishAndWait('collector.user.log.add', payload)
    const ch = collector.clickhouse
    const result = await ch
      .query('SELECT * FROM au_test.user_logs WHERE client_id = 122192')
      .toPromise()
    expect(result[0]).toMatchObject(payload)
  })

  test('should be get count by period', async () => {
    const amqp = (collector as any).amqp
    const resultByMinute: any[] = await amqp.publishAndWait(
      'collector.user.log.get',
      {
        type: 'countOpenByPeriod',
        options: {
          periodType: PeriodType.Minute,
          overlayType: 'ot_1',
          from: '2019-01-01 00:00:00',
          to: '2019-10-01 23:59:59',
        },
      },
    )

    const resultByMonth: any[] = await amqp.publishAndWait(
      'collector.user.log.get',
      {
        type: 'countOpenByPeriod',
        options: {
          periodType: PeriodType.Month,
          overlayType: 'ot_1',
          from: '2019-01-01 00:00:00',
          to: '2019-04-01 00:00:00',
        },
      },
    )

    expect(resultByMinute.sort()).toMatchObject(
      [
        { MinutePeriod: 0, count_open: 15 },
        { MinutePeriod: 3, count_open: 3 },
        { MinutePeriod: 2, count_open: 2 },
        { MinutePeriod: 1, count_open: 1 },
      ].sort(),
    )

    expect(resultByMonth.sort()).toMatchObject(
      [
        { MonthPeriod: 1, count_open: 14 },
        { MonthPeriod: 2, count_open: 1 },
        { MonthPeriod: 3, count_open: 1 },
      ].sort(),
    )
  })

  test('should be get popular device', async () => {
    const amqp = (collector as any).amqp

    const result: any[] = await amqp.publishAndWait('collector.user.log.get', {
      type: 'devicePopular',
      options: {
        from: '2019-01-01 00:00:00',
        to: '2019-10-01 23:59:59',
      },
    })

    expect(result.sort()).toMatchObject(
      [
        { device: 'd_1', count_device: 15 },
        { device: 'd_2', count_device: 6 },
        { device: 'd_3', count_device: 6 },
      ].sort(),
    )
  })

  test('should be get popular overlay by device', async () => {
    const amqp = (collector as any).amqp
    const result: any[] = await amqp.publishAndWait('collector.user.log.get', {
      type: 'popularOverlayByDevice',
      options: {
        device: 'd_1',
        from: '2019-01-01 00:00:00',
        to: '2019-10-01 23:59:59',
      },
    })

    expect(result.sort()).toMatchObject(
      [
        { overlay_type: 'ot_1', count_overlay: 9 },
        { overlay_type: 'ot_2', count_overlay: 3 },
        { overlay_type: 'ot_3', count_overlay: 3 },
      ].sort(),
    )
  })
})
