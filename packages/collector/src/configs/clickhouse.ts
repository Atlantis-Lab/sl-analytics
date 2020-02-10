import { ClickHouseConfig } from '../interfaces'

export const clickhouse: ClickHouseConfig = {
  url: process.env.CH_HOST || 'clickhouse',
  port: process.env.CH_PORT || '8123',
  basicAuth: {
    username: process.env.CH_USER || 'default',
    password: process.env.CH_PASSWORD || '',
  },
}
