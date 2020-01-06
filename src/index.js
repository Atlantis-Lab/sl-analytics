const { Microfleet } = require('@microfleet/core')

class MicrofleetApp extends Microfleet {
  constructor() {
    super({
      name: 'microfleet-app',
      router: {
        extensions: { register: [] },
      },
    })
  }
}

module.exports = MicrofleetApp
