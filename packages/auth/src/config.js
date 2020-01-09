const conf = require('ms-conf')
const path = require('path')

process.env.NCONF_NAMESPACE = process.env.NCONF_NAMESPACE || 'AU_AUTH'

conf.prependDefaultConfiguration(path.resolve(__dirname, './configs'))

module.exports = conf
