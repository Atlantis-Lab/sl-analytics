import { ClickHouse } from 'clickhouse'
import * as sqlstring from 'sqlstring'
import { migrations } from './migrations'

const dbName = process.env.CH_DB_NAME || 'au_test'

export async function clickHouseMigrator(ch: ClickHouse): Promise<void> {
  await initUserLogTable(ch)
  migrations.forEach(async migration => {
    if (!(await checkExistsMigration(ch, migration.name, migration.version))) {
      await migration.migrate(ch)
      await insertMigrationResult(ch, migration.name, migration.version)
    }
  })
}

async function initUserLogTable(ch) {
  await ch.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`).toPromise()

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

  await ch
    .query(
      `CREATE TABLE IF NOT EXISTS ${dbName}.user_logs (client_id Int32, overlay_open String, overlay_type String, device String, event_date Date, event_time DateTime) ENGINE = MergeTree(event_date, (client_id, overlay_type), 8192)`,
    )
    .toPromise()
}

async function checkExistsMigration(
  ch: ClickHouse,
  name: string,
  version: string,
) {
  const data = await ch
    .query(
      `SELECT
	id,
	name,
	version,
	create_date
FROM
	${dbName}.migrations
WHERE
  name=${sqlstring.escape(name)} AND version=${sqlstring.escape(version)}
LIMIT 100`,
    )
    .toPromise()

  return data.length > 0
}

async function insertMigrationResult(
  ch: ClickHouse,
  name: string,
  version: string,
) {
  const ws: any = ch.insert(`INSERT INTO ${dbName}.migrations`).stream()
  await ws.writeRow([
    new Date().getTime(),
    name,
    version,
    new Date().toISOString().split('T')[0],
  ])

  return ws.exec()
}
