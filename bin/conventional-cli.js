#!/usr/bin/env node
const path = require('path')
const fs = require('fs')

// Read command parameter
const command = (process.argv[2]) ? process.argv[2].split(':') : ['help']
let action = command[0]
let type = command[1] || null;
let mode = command[2] || 'development';

// Support shortcuts like build:production, watch:development
if (['production', 'development'].includes(type)) {
  type = null
  mode = command[1]
}

if (!['help', 'init', 'build', 'watch', 'lint', 'test', 'browsertest'].includes(action)) {
  console.error(`ERROR: Invalid command ${action}`)
  process.exit(1)
}

// Determine working directory
const workingDir = (process.argv[3]) ? path.resolve(process.argv[3]) : process.cwd()

if (!fs.existsSync(workingDir) || !fs.lstatSync(workingDir).isDirectory()) {
  console.error('ERROR: The specified path does not exist or is not a directory.')
  process.exit(1)
}

// Fetch .env file
require('dotenv').config({ path: path.resolve(workingDir, '.env') })

// Read config file
const configFile = path.resolve(workingDir, 'conventional.config.json')
const conventionalConfig = (fs.existsSync(configFile)) ? require(configFile) : {}

// Execute command
console.log(`Executing command: ${command.join(':')} ...`)
const conventionalFunc = require('../lib/conventional')
conventionalFunc(action, type, mode, workingDir, conventionalConfig)
