const log4js = require("log4js");

log4js.configure({
    appenders: { 
      usual: { 
        type: "file", 
        filename: "./logs/logs.log",
        maxLogSize: 10 * 1024 * 1024, // = 10Mb
        backups: 5, // keep five backup files
        compress: true, // compress the backups
        encoding: 'utf-8',
        layout: {
          type: 'pattern',
          pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] [%z] - %f(%l): %m',
        }
      }
    },
    categories: { 
      default: { 
        appenders: ["usual"], 
        level: "info",
        enableCallStack: true
      }
    }
  });

const logger = log4js.getLogger("cheese");
logger.info("Application started: initialized log file");

module.exports = logger