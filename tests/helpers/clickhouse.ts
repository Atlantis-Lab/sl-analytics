export const reset = async (ch, dbName = 'au_test') => {
  await ch.query(`DROP TABLE ${dbName}.user_logs`).toPromise()
  await ch.query(`DROP TABLE ${dbName}.migrations`).toPromise()
  await ch
    .query(
      `CREATE TABLE IF NOT EXISTS ${dbName}.user_logs (client_id Int32, overlay_open String, overlay_type String, device String, event_date Date, event_time DateTime) ENGINE = MergeTree(event_date, (client_id, overlay_type), 8192)`,
    )
    .toPromise()

  await ch
    .query(
      `CREATE TABLE IF NOT EXISTS ${dbName}.migrations (
    id UInt32,  
    name String,  
    version String,  
    create_date Date DEFAULT toDate(0)
  ) ENGINE = MergeTree(create_date, id, 8192);`,
    )
    .toPromise()
}
