const { transports, format, createLogger: logger } = require("winston");
const { detect } = require("detect-browser");
const path = require("path");
//const { combine, timestamp, label, prettyPrint, printf } = format;

const createLogger = ({ label, logBase }) => {
  console.log(path.join(logBase || "", "error.log"));
  let innerLogger = null;
  if (detect().type === "node") {
    const fileFormat = format.combine(
      format.label({ label, message: false }),
      format.timestamp(),
      format.json()
    );
    innerLogger = logger({
      level: "info",
      transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new transports.File({
          filename: path.join(logBase || "", "error.log"),
          level: "error",
          format: fileFormat,
          maxsize: 5242880,
          maxFiles: 1,
        }),
        new transports.File({
          filename: path.join(logBase || "", "combined.log"),
          format: fileFormat,
          maxsize: 5242880,
          maxFiles: 5,
        }),
      ],
    });
  } else {
    innerLogger = logger();
  }
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  const consoleFormat = format.combine(
    format.label({ label, message: true }),
    format.align(),
    format.timestamp(),
    format.colorize(),
    format.printf((info) => {
      //console.log(JSON.stringify(info.message));
      return `${info.timestamp} ${info.level}: ${info.message.trim()}`;
    })
  );

  if (process.env.NODE_ENV !== "production") {
    innerLogger.add(
      new transports.Console({
        level: "debug",
        format: consoleFormat,
      })
    );
  }

  return innerLogger;
};

module.exports = createLogger;

// logger.info(JSON.stringify({ test: "test", info: "info" }));
// logger.error("error");
