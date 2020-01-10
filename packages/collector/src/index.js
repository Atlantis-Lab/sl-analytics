const { Microfleet, ConnectorsTypes } = require('@microfleet/core')
const { ClickHouse } = require('clickhouse')
const merge = require('lodash/merge')

class Collector extends Microfleet {
  static defaultOpts = require('./config').get('/', {
    env: process.env.NODE_ENV,
  })

  constructor(opts = {}) {
    super(merge({}, Collector.defaultOpts, opts))

    this.clickhouse = new ClickHouse({
      url: process.env.CH_HOST,
      port: process.env.CH_PORT,
      basicAuth: {
        username: process.env.CH_USER,
        password: process.env.CH_PASSWORD || '',
      },
    })

    this.addConnector(ConnectorsTypes.application, () => this.initClickhouse())
  }

  initClickhouse = require('./scripts/init')
}

module.exports = Collector
