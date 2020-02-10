import { Microfleet, ConnectorsTypes } from '@microfleet/core'
import { merge } from 'lodash'
import { config } from './configs'
import { initClickHouse } from './externals/clickhouse'
import { initClickhouseTables } from './externals/utils'
import { clickHouseMigrator } from './migration/clickhouse/migrator'

export class CollectorApp extends Microfleet {
  constructor(options = {}) {
    super(merge({}, config, options))

    this.clickhouse = initClickHouse(config.clickhouse)

    this.addMigrator('clickhouse', () => {
      clickHouseMigrator(this.clickhouse)
    })

    this.addConnector(ConnectorsTypes.application, initClickhouseTables)

    this.addConnector(ConnectorsTypes.migration, async () => {
      this.migrate('clickhouse')
    })
  }
}
