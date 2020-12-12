const log4js = require('log4js');

module.exports = class {
  constructor(env = 'production') {
    this.env = env;
    log4js.configure({
      appenders: {
        file: {
          type: 'file',
          filename: __dirname + '/../../../runtime/logs/app.log',
          maxLogSize: 31457280, // = 30Mb
          numBackups: 10, // keep five backup files
          compress: false, // compress the backups
          encoding: 'utf-8',
        },
        dateFile: {
          type: 'dateFile',
          filename: __dirname + '/../../../runtime/logs/app',
          alwaysIncludePattern: true,
          maxLogSize: 31457280, // = 30Mb
          pattern: 'yyyy-MM-dd.log',
          compress: false,
          daysToKeep: 30,
          layout: {
            type: 'pattern',
            pattern: '%r %p - %m',
          }
        },
        console: {
          type: 'console'
        }
      },
      categories: {
        default: {
          appenders: ['console'],
          level: 'all'
        },
        file: {
          appenders: ['file'],
          level: 'info'
        },
        dateFile: {
          appenders: ['dateFile'],
          level: 'debug'
        },
      }
    });
    const dev = (env === 'production');
    const output = dev ? 'dateFile' : 'default';
    this.logger = log4js.getLogger(output);
  }

  trace(...str) {
    this.logger.trace(...str);
  }

  debug(...str) {
    this.logger.debug(...str);
  }

  info(...str) {
    this.logger.info(...str);
  }

  warn(...str) {
    this.logger.warn(...str);
  }

  sql(...str) {
    if (this.env === 'development') {
      this.logger.warn(...str);
    }
  }

  error(...str) {
    this.logger.error(...str);
  }

  fatal(...str) {
    this.logger.fatal(...str);
  }

};