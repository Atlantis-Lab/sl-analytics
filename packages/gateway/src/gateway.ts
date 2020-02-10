import { Microfleet } from '@microfleet/core'
import { merge } from 'lodash'
import { config } from './configs'

export class GatewayApp extends Microfleet {
  constructor(options = {}) {
    super(merge({}, config, options))
  }
}
