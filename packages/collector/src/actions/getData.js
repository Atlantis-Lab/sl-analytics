const { ActionTransport } = require('@microfleet/core')

const dbName = process.env.CH_DB_NAME || 'au'

const presets = {
  countOpenByPeriod: ({ periodType, overlayType, from, to, limit = 1000 }) => `
    SELECT
      to${periodType}(toDateTime(event_time)) as ${periodType}Period,
      count( ) as count_open
    FROM
    ${dbName}.user_logs
    WHERE
      overlay_type='${overlayType}' AND event_time BETWEEN '${from}' AND '${to}'
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
      event_time BETWEEN '${from}' AND '${to}'
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
      device='${device}' AND event_time BETWEEN '${from}' AND '${to}'
    GROUP BY
      overlay_type
    ORDER BY
      count_overlay DESC
    LIMIT ${limit}
  `,
}

async function getData({ params }) {
  const ch = this.clickhouse
  const { type, options } = params
  const statement = presets[type](options)

  const rows = await ch.query(statement).toPromise()

  return rows
}

getData.transports = [ActionTransport.amqp]

module.exports = getData
