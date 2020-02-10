export async function initClickhouseTables() {
  const ch = this.clickhouse

  await initUserLogTable(ch)
}

async function initUserLogTable(ch) {
  const dbName = process.env.CH_DB_NAME || 'au_test'

  await ch.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`).toPromise()
  await ch
    .query(
      `CREATE TABLE IF NOT EXISTS ${dbName}.user_logs (client_id Int32, overlay_open String, overlay_type String, device String, event_date Date, event_time DateTime) ENGINE = MergeTree(event_date, (client_id, overlay_type), 8192)`,
    )
    .toPromise()
}
