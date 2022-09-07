#!/usr/bin/env node

const { red, green } = require('colors');
const argv = require('minimist')(process.argv.slice(2));
const converter = require('../lib/converter');
const parser = require('../lib.parser');

const { data, error, savedToFile } = converter(argv);

if (error) {
  console.log(error.red);
} else if (savedToFile && data) {
  console.log(`Saved to file ${savedToFile}`.green);
} else {
  console.log(JSON.stringify(data, null, 4));
}
