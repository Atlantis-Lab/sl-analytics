import { ActionTransport, routerExtension } from '@microfleet/core'
import * as path from 'path'
import { RouterConfig } from '@microfleet/core/lib/plugins/router/factory'

export const router: RouterConfig = {
  routes: {
    enabled: {},
    directory: path.join(__dirname, '../actions'),
    prefix: 'collector',
    setTransportsAsDefault: false,
    transports: [ActionTransport.amqp],
    enabledGenericActions: ['health'],
  },
  extensions: {
    enabled: ['postRequest', 'preRequest', 'preResponse', 'postResponse'],
    register: [routerExtension('validate/schemaLessAction')],
  },
  auth: {
    strategies: {},
  },
}
