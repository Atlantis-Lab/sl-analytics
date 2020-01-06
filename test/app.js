const MicrofleetApp = require("../src");

describe("server", () => {
  it("should be able to start", async () => {
    const microfleetApp = new MicrofleetApp();
    await microfleetApp.connect();
    await microfleetApp.close();
  });
});
