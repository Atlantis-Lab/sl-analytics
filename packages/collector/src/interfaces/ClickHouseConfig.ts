export interface ClickHouseConfig {
  url: string
  port: string
  basicAuth: {
    username: string
    password: string
  }
}
