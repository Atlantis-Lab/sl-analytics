import { GatewayApp } from './gateway'

const service = new GatewayApp()
;(async () => {
  try {
    await service.connect()
  } catch (err) {
    service.log.fatal({ err }, 'service crashed')
    return setImmediate(() => {
      throw err
    })
  }

  service.log.info('service started')
})()
