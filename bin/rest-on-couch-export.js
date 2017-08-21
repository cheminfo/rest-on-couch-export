#!/usr/bin/env node
'use strict';

process.on('unhandledRejection', function (e) {
    throw e;
});

const {exportData} = require('..');

require('yargs')
    .command('user <email>', 'Export the data of a specific user', () => {}, exportData)
    .command('all', 'Export the data of all users', () => {}, exportData)
    .option('u', {
        alias: 'url',
        describe: 'URL to the rest-on-couch database',
        demandOption: true,
        type: 'string'
    })
    .option('o', {
        alias: 'out',
        describe: 'Output directory',
        demandOption: true,
        type: 'string'
    })
    .option('t', {
        alias: 'token',
        describe: 'User token to access private data',
        type: 'string'
    })
    .recommendCommands()
    .demandCommand(1, 1, 'You need to provide a command')
    .version()
    .help()
    .argv;
