import { ClickHouse } from 'clickhouse'
import { ClickHouseConfig } from '../interfaces'

export const initClickHouse = (clickhouseConfig: ClickHouseConfig) => {
  return new ClickHouse(clickhouseConfig)
}
