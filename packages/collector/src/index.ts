import { CollectorApp } from './collector'
export { CollectorApp } from './collector'
export { config } from './configs'
export { PeriodType } from './enums/periodType'

const service = new CollectorApp()
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
