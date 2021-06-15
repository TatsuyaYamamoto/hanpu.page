require("ts-node").register({
  project: __dirname + "/tsconfig.json"
});
const { setHeadlessWhen } = require("@codeceptjs/configure");

const { HEADLESS, TEST_BASE_URL = "https://dl-code-dev.web.app" } = process.env;

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(HEADLESS);

exports.config = {
  tests: "./tests/*.test.ts",
  output: "./output",
  helpers: {
    Playwright: {
      url: TEST_BASE_URL,
      show: true,
      browser: "chromium",
      restart: false
    }
  },
  include: {
    I: "./steps_file.ts",
    topPage: "./pages/topPage.ts",
    verifyPage: "./pages/verifyPage.ts"
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
