#!/usr/bin/env node

/**
 * Print Job Scheduler
 * CLI tool for optimizing print job schedules
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import parseDuration from 'parse-duration';

const log = {
  info: (msg: string): void => console.log(chalk.blue(msg)),
  success: (msg: string): void => console.log(chalk.green(msg)),
  warning: (msg: string): void => console.log(chalk.yellow(msg)),
  error: (msg: string): void => console.log(chalk.red(msg)),
};

yargs(hideBin(process.argv))
  .scriptName(chalk.cyan('schedule'))
  .usage(`${chalk.cyan('$0')} <cmd> [args]`)
  .version()
  .alias('v', 'version')
  .help()
  .alias('h', 'help')
  // Commands will be added here
  .demandCommand(1, chalk.yellow('You need to specify a command'))
  .fail((msg: string, err: Error) => {
    if (err) log.error(err.message);
    if (msg) log.error(msg);
    process.exit(1);
  })
  .strict()
  .parse();
