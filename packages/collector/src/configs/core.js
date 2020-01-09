exports.name = 'au-collector'

exports.debug = process.env.NODE_ENV !== 'production'

exports.logger = {
  defaultLogger: true,
  debug: process.env.NODE_ENV !== 'production',
}
