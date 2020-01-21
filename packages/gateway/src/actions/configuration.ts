import { ActionTransport } from '@microfleet/core'

export default function getConfigurationAction() {
  return JSON.stringify(this.config, null, 2)
}

getConfigurationAction.transports = [ActionTransport.http]
