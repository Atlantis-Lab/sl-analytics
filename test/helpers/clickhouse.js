const { ClickHouse } = require('clickhouse')

// [client_id, overlay_open, overlay_type, device, event_date, event_time]
const userLogs = [
  [1, 'oo_1', 'ot_1', 'd_1', '2019-01-01', '2019-01-01 00:00:00'],
  [1, 'oo_1', 'ot_1', 'd_2', '2019-01-01', '2019-01-01 00:01:01'],
  [1, 'oo_1', 'ot_1', 'd_3', '2019-01-01', '2019-01-01 00:03:03'],
  [2, 'oo_1', 'ot_2', 'd_1', '2019-01-01', '2019-01-01 00:01:00'],
  [2, 'oo_1', 'ot_1', 'd_2', '2019-01-01', '2019-01-01 00:02:01'],
  [2, 'oo_1', 'ot_1', 'd_3', '2019-01-01', '2019-01-01 00:03:03'],
  [3, 'oo_1', 'ot_3', 'd_1', '2019-01-01', '2019-01-01 00:01:00'],
  [3, 'oo_1', 'ot_1', 'd_2', '2019-01-01', '2019-01-01 00:02:01'],
  [3, 'oo_1', 'ot_1', 'd_3', '2019-01-01', '2019-01-01 00:03:03'],

  [1, 'oo_1', 'ot_1', 'd_1', '2019-01-01', '2019-01-01 00:00:00'],
  [1, 'oo_1', 'ot_1', 'd_2', '2019-01-02', '2019-01-02 00:00:01'],
  [1, 'oo_1', 'ot_1', 'd_3', '2019-01-03', '2019-01-03 00:00:03'],
  [2, 'oo_1', 'ot_2', 'd_1', '2019-01-04', '2019-01-04 00:00:00'],
  [2, 'oo_1', 'ot_1', 'd_2', '2019-01-05', '2019-01-05 00:00:01'],
  [2, 'oo_1', 'ot_1', 'd_3', '2019-01-06', '2019-01-06 00:00:03'],
  [3, 'oo_1', 'ot_3', 'd_1', '2019-01-07', '2019-01-07 00:00:00'],
  [3, 'oo_1', 'ot_1', 'd_2', '2019-01-08', '2019-01-08 00:00:01'],
  [3, 'oo_1', 'ot_1', 'd_3', '2019-01-09', '2019-01-09 00:00:03'],

  [1, 'oo_1', 'ot_1', 'd_1', '2019-02-01', '2019-02-01 00:00:00'],
  [1, 'oo_1', 'ot_1', 'd_1', '2019-03-01', '2019-03-01 00:00:01'],
  [1, 'oo_1', 'ot_1', 'd_1', '2019-04-01', '2019-04-01 00:00:03'],
  [2, 'oo_1', 'ot_2', 'd_1', '2019-05-01', '2019-05-01 00:00:00'],
  [2, 'oo_1', 'ot_1', 'd_1', '2019-06-01', '2019-06-01 00:00:01'],
  [2, 'oo_1', 'ot_1', 'd_1', '2019-07-01', '2019-07-01 00:00:03'],
  [3, 'oo_1', 'ot_3', 'd_1', '2019-08-01', '2019-08-01 00:00:00'],
  [3, 'oo_1', 'ot_1', 'd_1', '2019-09-01', '2019-09-01 00:00:01'],
  [3, 'oo_1', 'ot_1', 'd_1', '2019-10-01', '2019-10-01 00:00:03'],
]

exports.sampleUserLogsData = async (ch, dbName = 'au_test') => {
  const ws = ch.insert(`INSERT INTO ${dbName}.user_logs`).stream()
  for (let i = 0; i < userLogs.length; i++) {
    await ws.writeRow(userLogs[i])
  }

  return ws.exec()
}

exports.cleanUserLogsTable = async (ch, dbName = 'au_test') => {
  await ch.query('DROP TABLE au_test.user_logs').toPromise()
  await ch
    .query(
      `CREATE TABLE IF NOT EXISTS ${dbName}.user_logs (client_id Int32, overlay_open String, overlay_type String, device String, event_date Date, event_time DateTime) ENGINE = MergeTree(event_date, (client_id, overlay_type), 8192)`,
    )
    .toPromise()
}

exports.clickhouse = new ClickHouse({
  database: 'au',
  url: process.env.CH_HOST || 'clickhouse',
  port: process.env.CH_PORT || 8123,
  basicAuth: {
    username: process.env.CH_USER || 'default',
    password: process.env.CH_PASSWORD || '',
  },
})
