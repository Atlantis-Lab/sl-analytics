const { ActionTransport } = require('@microfleet/core')

const presets = {
  countOpenByPeriod: ({ periodType, overlayType, from, to, limit = 1000 }) => `
    SELECT
      to${periodType}(toDateTime(event_time)) as ${periodType},
      count( ) as count_open
    FROM
    au.user_logs
    WHERE
      overlay_type='${overlayType}' AND event_time BETWEEN '${from}' AND '${to}'
    GROUP BY
      ${periodType}
    ORDER BY
      count_open DESC
    LIMIT ${limit}
  `,
  devicePopular: ({ from, to, limit = 1000 }) => `
    SELECT
      device,
      count( ) as count_device
    FROM
      au.user_logs
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
      au.user_logs
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

  const { data } = await ch.querying(statement, { dataObjects: true })

  return data
}

getData.transports = [ActionTransport.amqp]

module.exports = getData
