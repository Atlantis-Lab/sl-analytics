import { ActionTransport, routerExtension } from '@microfleet/core'
import * as path from 'path'
import { RouterConfig } from '@microfleet/core/lib/plugins/router/factory'
import { jwtToken } from '../auth/strategies/jwtToken'
import { xSlrToken } from '../auth/strategies/xSlrToken'

export const router: RouterConfig = {
  routes: {
    enabled: {},
    directory: path.join(__dirname, '../actions'),
    prefix: 'gateway',
    setTransportsAsDefault: false,
    transports: [ActionTransport.amqp, ActionTransport.http],
    enabledGenericActions: ['health'],
  },
  extensions: {
    enabled: ['postRequest', 'preRequest', 'preResponse', 'postResponse'],
    register: [routerExtension('validate/schemaLessAction')],
  },
  auth: {
    strategies: { xSlrToken, jwtToken },
  },
}
