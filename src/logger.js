'use strict';

const winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: 'info',
    colorize: true
});

module.exports = winston;
