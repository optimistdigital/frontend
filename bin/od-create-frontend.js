#! /usr/bin/env node
'use strict';
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline-sync');
const chalk = require('chalk');
const getPackageJson = require('../scripts/getPackageJson');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const args = require('minimist')(process.argv.slice(2));

const CURRENT_DIR = process.cwd();
const TEMPLATE_PATH = path.resolve(__dirname, '..', 'template');

const error = (err, ...rest) => console.error(chalk.red.bold(err), ...rest);
const info = (msg, ...rest) => console.info(chalk.blue(msg), ...rest);
const success = (msg, ...rest) => console.info(chalk.green(msg), ...rest);
const log = (...args) => console.log(...args);

function getProjectNameFromCwd() {
  const folders = CURRENT_DIR.split('/');
  return folders[folders.length - 1];
}

function getConfirmation() {
  return readline.question(
    `Are you sure you want to generate a front-end for ${getProjectNameFromCwd()}? (y/N) `
  );
}

function findExistingFrontendFiles() {
  const needles = [path.resolve(CURRENT_DIR, 'package.json')];
  const output = needles.filter(file => fs.existsSync(file));

  fs.readdirSync(TEMPLATE_PATH).forEach(file => {
    const destinationPath = path.resolve(CURRENT_DIR, file);
    if (fs.existsSync(destinationPath)) {
      output.push(destinationPath);
    }
  });

  return output;
}

function init() {
  // Get confirmation from user
  if (getConfirmation().toLowerCase() !== 'y') {
    log('Aborting.');
    return;
  }

  // Check if cwd has conflicting ciles
  const existingFrontendFiles = findExistingFrontendFiles();
  if (existingFrontendFiles.length > 0) {
    error(
      `We have detected an existing frontend setup in your current directory.
Please remove the following files and retry:`
    );
    log(existingFrontendFiles.map(name => `- ${name}`).join('\n'));

    return;
  }

  // Generate package.json
  const packageJson = getPackageJson({
    name: getProjectNameFromCwd(),
    isDev: !!args.dev,
  });
  // Write package.json into cwd
  fs.writeFileSync(path.resolve(CURRENT_DIR, 'package.json'), packageJson);
  // Copy contents of template folder into cwd
  fs.copySync(TEMPLATE_PATH, CURRENT_DIR);
  // Install npm dependencies
  success('OD frontend boilerplate generated.');
  info('Installing modules (this may take some time)...\n');
  exec(`npm install`)
    .then(res => {
      log(res.stderr);
      success('Done!');
      success('For development, type `npm run dev`.');
      success('For production, type `npm run build`.');
      success('Documentation: https://github.com/optimistdigital/frontend');
    })
    .catch(err => {
      error('Installing node modules failed:', err.message);
    });
}

init();