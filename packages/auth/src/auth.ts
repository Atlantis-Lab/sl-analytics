import { Microfleet } from '@microfleet/core'
import { merge } from 'lodash'
import { config } from './configs'

export class AuthApp extends Microfleet {
  constructor(options = {}) {
    super(merge({}, config, options))
  }
}
