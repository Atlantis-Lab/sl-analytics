const { Microfleet } = require("@microfleet/core");

class MicrofleetApp extends Microfleet {
  constructor() {
    super({
      name: "microfleet-app"
    });
  }
}

module.exports = MicrofleetApp;
