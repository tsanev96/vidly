const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
// TODO: winston mongodb, log errors in the console

module.exports = function () {
  process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
};
