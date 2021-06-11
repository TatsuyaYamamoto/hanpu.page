require("ts-node").register({
  project: __dirname + "/tsconfig.json"
});
const { setHeadlessWhen } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: "./*.test.ts",
  output: "./output",
  helpers: {
    Playwright: {
      url: "http://localhost",
      show: true,
      browser: "chromium"
    }
  },
  include: {
    I: "./steps_file.js"
  },
  bootstrap: null,
  mocha: {},
  name: "dl-code_web_app",
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
};
