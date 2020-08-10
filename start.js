const createLogger = require("./lib/index");

const logger = createLogger({ label: "API", logBase: "log" });
logger.info("info message");
logger.error("error message");
logger.debug("debug message");
