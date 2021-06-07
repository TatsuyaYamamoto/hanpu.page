import { config as _config } from "firebase-functions";

interface Config {
  slack: {
    webhook_url: string;
  };
}

const config = _config() as Config;
export default config;

// validate config is set or on when trying `firebase deploy`.
(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  config.slack.webhook_url;
})();
