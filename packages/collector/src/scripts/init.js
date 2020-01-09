async function init() {
  const ch = this.clickhouse

  await ch.querying('CREATE DATABASE IF NOT EXISTS au')
  await ch.querying(
    'CREATE TABLE IF NOT EXISTS au.user_logs (client_id Int32, overlay_open String, overlay_type String, device String, event_date Date, event_time DateTime) ENGINE = MergeTree(event_date, (client_id, overlay_type), 8192)',
  )
}

module.exports = init
