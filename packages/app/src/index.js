const { Microfleet } = require('@microfleet/core')
const merge = require('lodash/merge')

class MicrofleetApp extends Microfleet {
  static defaultOpts = require('./config').get('/', {
    env: process.env.NODE_ENV,
  })

  constructor(opts = {}) {
    super(merge({}, MicrofleetApp.defaultOpts, opts))
  }
}

module.exports = MicrofleetApp
