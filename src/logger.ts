// tslint:disable:no-var-requires
import { createLogger, INFO, DEBUG, stdSerializers } from "browser-bunyan";
const {
  ConsoleFormattedStream
} = require("@browser-bunyan/console-formatted-stream");

const l = createLogger({
  name: "myLogger",
  streams: [
    {
      level: INFO, // or use the string 'info'
      stream: new ConsoleFormattedStream()
    }
  ],
  serializers: stdSerializers,
  src: true
});

const logLevel = process.env.NODE_ENV === "production" ? INFO : DEBUG;

function getLogger(name: string) {
  return createLogger({
    name,
    streams: [
      {
        level: logLevel,
        stream: new ConsoleFormattedStream()
      }
    ],
    serializers: stdSerializers,
    src: true
  });
}

export { getLogger };
