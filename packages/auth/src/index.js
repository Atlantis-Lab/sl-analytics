const { Microfleet } = require('@microfleet/core')
const merge = require('lodash/merge')

class Auth extends Microfleet {
  static defaultOpts = require('./config').get('/', {
    env: process.env.NODE_ENV,
  })

  constructor(opts = {}) {
    super(merge({}, Auth.defaultOpts, opts))
  }
}

module.exports = Auth
