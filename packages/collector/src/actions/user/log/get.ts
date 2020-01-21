import { ActionTransport } from '@microfleet/core'
import * as sqlstring from 'sqlstring'
import { PeriodType } from '../../..'

const dbName = process.env.CH_DB_NAME || 'au_test'

interface CountOpenByPeriodParams {
  periodType: PeriodType
  overlayType: string
  from: string
  to: string
  limit: number
}

const presets = {
  countOpenByPeriod: ({
    periodType,
    overlayType,
    from,
    to,
    limit = 1000,
  }: CountOpenByPeriodParams) => `
    SELECT
      to${periodType}(toDateTime(event_time)) as ${periodType}Period,
      count( ) as count_open
    FROM
    ${dbName}.user_logs
    WHERE
      overlay_type=${sqlstring.escape(
        overlayType,
      )} AND event_time BETWEEN ${sqlstring.escape(
    from,
  )} AND ${sqlstring.escape(to)}
    GROUP BY
      ${periodType}Period
    ORDER BY
      count_open DESC
    LIMIT ${limit}
  `,
  devicePopular: ({ from, to, limit = 1000 }) => `
    SELECT
      device,
      count( ) as count_device
    FROM
      ${dbName}.user_logs
    WHERE
      event_time BETWEEN ${sqlstring.escape(from)} AND ${sqlstring.escape(to)}
    GROUP BY
      device
    ORDER BY
      count_device DESC
    LIMIT ${limit}
  `,
  popularOverlayByDevice: ({ device, from, to, limit = 1000 }) => `
    SELECT
      overlay_type,
      count( ) as count_overlay
    FROM
      ${dbName}.user_logs
    WHERE
      device=${sqlstring.escape(
        device,
      )} AND event_time BETWEEN ${sqlstring.escape(
    from,
  )} AND ${sqlstring.escape(to)}
    GROUP BY
      overlay_type
    ORDER BY
      count_overlay DESC
    LIMIT ${limit}
  `,
}

export default async function get({ params }) {
  const ch = this.clickhouse
  const { type, options } = params
  const statement = presets[type](options)

  return await ch.query(statement).toPromise()
}

get.transports = [ActionTransport.amqp]
