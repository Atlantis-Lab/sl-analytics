import { core } from './core'
import { plugins } from './plugins'
import { router } from './router'
import { validator } from './validator'
import { jwt } from './jwt'
import { amqp } from './amqp'

export const config = {
  ...core,
  plugins,
  router,
  validator,
  jwt,
  amqp,
}
