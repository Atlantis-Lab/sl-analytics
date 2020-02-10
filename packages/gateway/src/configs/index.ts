import { core } from './core'
import { plugins } from './plugins'
import { router } from './router'
import { validator } from './validator'
import { amqp } from './amqp'
import { http } from './http'

export const config = {
  ...core,
  plugins,
  router,
  validator,
  http,
  amqp,
}
