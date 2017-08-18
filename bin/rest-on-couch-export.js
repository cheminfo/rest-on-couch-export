#!/usr/bin/env node
'use strict';

process.on('unhandledRejection', function (e) {
    throw e;
});

const rocExport = require('..');

require('yargs')
    .command('user <email>', 'Export the data of a specific user', () => {}, function (argv) {
        rocExport.exportUser(argv);
    })
    .command('all', 'Export the data of all users')
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
    .help().argv;
