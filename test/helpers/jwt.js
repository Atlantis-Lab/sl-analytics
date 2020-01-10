const jwt = require('jsonwebtoken')

exports.jwtSign = (payload, secret) => {
  return jwt.sign(payload, secret)
}
