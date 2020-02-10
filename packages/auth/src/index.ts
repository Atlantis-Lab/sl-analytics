import { AuthApp } from './auth'
export { AuthApp } from './auth'
export { config } from './configs'

const service = new AuthApp()
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
