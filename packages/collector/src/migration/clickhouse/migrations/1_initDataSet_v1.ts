import { ClickHouse } from 'clickhouse'

export const initDatasetV1 = {
  name: '1_init_dataset_v1',
  version: 'v1',
  migrate: (ch: ClickHouse) => {
    ch.sessionId
    return true
  },
}
