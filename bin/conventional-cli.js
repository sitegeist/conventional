#!/usr/bin/env node
const path = require('path')
const fs = require('fs')

const command = (process.argv[2]) ? process.argv[2].split(':') : ['help']
/* this can be done better: */
if (command[1] === 'production') {
  command[1] = undefined
  command[2] = 'production'
} else if (!command[2]) {
  command[2] = 'development'
}

const workingDir = (process.argv[3]) ? path.resolve(process.argv[3]) : process.cwd()

if (!fs.existsSync(workingDir) || !fs.lstatSync(workingDir).isDirectory()) {
  console.error('ERROR: The specified path does not exist or is not a directory.')
  process.exit()
}

if (!['help', 'init', 'build', 'watch', 'lint', 'browsertest'].includes(command[0])) {
  console.error(`ERROR: Invalid command ${command[0]}`)
  process.exit()
}

// console.log(`Working Directory: ${workingDir}`);

console.log('Reading environment ...')
// require('dotenv').config({ path: path.resolve(workingDir, '.env') }) -> not working when linked? worked when normally installed

console.log(`Executing command: ${command} ...`)

const configFile = path.resolve(workingDir, 'conventional.config.json')

const conventionalConfig = (fs.existsSync(configFile)) ? require(configFile) : {}

// const commandFunc = require('./commands/' + command[0])
// commandFunc(command, workingDir, conventionalConfig)

const conventionalFunc = require('../lib/conventional')
conventionalFunc({ action: command[0], type: command[1], mode: command[2] }, workingDir, conventionalConfig)

// process.exit();
