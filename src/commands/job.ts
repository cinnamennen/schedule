import type { CommandModule } from 'yargs';
import chalk from 'chalk';
import { parseToMinutes, formatMinutes } from '../utils';
import { dbService } from '../services/db';

const job = {
  command: 'job',
  describe: 'Manage print jobs',
  builder: (yargs) =>
    yargs
      .command({
        command: 'add [name] [duration]',
        describe: 'Add a new print job',
        builder: (yargs) =>
          yargs
            .positional('name', {
              type: 'string',
              describe: 'Name of the print job',
            })
            .positional('duration', {
              type: 'string',
              describe: 'Duration of the job (e.g., "1h30m", "45m")',
            })
            .option('n', {
              alias: 'name',
              type: 'string',
              describe: 'Name of the print job',
            })
            .option('d', {
              alias: 'duration',
              type: 'string',
              describe: 'Duration of the job (e.g., "1h30m", "45m")',
            })
            .check((argv) => {
              const name = argv.n || argv.name || argv._[1];
              const duration = argv.d || argv.duration || argv._[2];
              if (!name) throw new Error('Job name is required');
              if (!duration) throw new Error('Job duration is required');
              return true;
            }),
        handler: async (argv) => {
          try {
            const name = (argv.n || argv.name || argv._[1]) as string;
            const durationStr = (argv.d || argv.duration || argv._[2]) as string;
            const duration = parseToMinutes(durationStr);
            const job = await dbService.addJob(name, duration);
            console.log(
              chalk.green(
                `Added job "${job.name}" (${formatMinutes(job.duration)}) with ID: ${chalk.blue(job.id)}`
              )
            );
          } catch (error) {
            console.error(chalk.red(`Error: ${(error as Error).message}`));
          }
        },
      })
      .command({
        command: 'list',
        describe: 'List all print jobs',
        handler: async () => {
          try {
            const jobs = await dbService.getJobs();
            if (jobs.length === 0) {
              console.log(chalk.yellow('No jobs found'));
              return;
            }

            console.log(chalk.blue('\nJobs:'));
            console.log(chalk.dim('─'.repeat(50)));
            jobs.forEach((job) => {
              console.log(
                `${chalk.green(job.name)} (${chalk.blue(job.id)})
  Duration: ${chalk.yellow(formatMinutes(job.duration))}
  Created: ${chalk.dim(new Date(job.createdAt).toLocaleString())}`
              );
              console.log(chalk.dim('─'.repeat(50)));
            });
          } catch (error) {
            console.error(chalk.red(`Error: ${(error as Error).message}`));
          }
        },
      })
      .command({
        command: 'remove <id>',
        describe: 'Remove a print job',
        builder: (yargs) =>
          yargs.positional('id', {
            type: 'string',
            describe: 'ID of the job to remove',
          }),
        handler: async (argv) => {
          try {
            const job = await dbService.getJob(argv.id as string);
            if (!job) {
              console.error(chalk.red(`Job not found: ${argv.id}`));
              return;
            }

            await dbService.removeJob(argv.id as string);
            console.log(
              chalk.yellow(`Removed job "${job.name}" (${formatMinutes(job.duration)})`)
            );
          } catch (error) {
            console.error(chalk.red(`Error: ${(error as Error).message}`));
          }
        },
      })
      .command({
        command: 'edit <id> [name] [duration]',
        describe: 'Edit a print job',
        builder: (yargs) =>
          yargs
            .positional('id', {
              type: 'string',
              describe: 'ID of the job to edit',
            })
            .positional('name', {
              type: 'string',
              describe: 'New name for the job',
            })
            .positional('duration', {
              type: 'string',
              describe: 'New duration for the job (e.g., "1h30m", "45m")',
            })
            .option('n', {
              alias: 'name',
              type: 'string',
              describe: 'New name for the job',
            })
            .option('d', {
              alias: 'duration',
              type: 'string',
              describe: 'New duration for the job (e.g., "1h30m", "45m")',
            })
            .check((argv) => {
              const hasName = argv.n || argv.name || argv._[2];
              const hasDuration = argv.d || argv.duration || argv._[3];
              if (!hasName && !hasDuration) {
                throw new Error('At least one of name or duration must be specified');
              }
              return true;
            }),
        handler: async (argv) => {
          try {
            const updates: { name?: string; duration?: number } = {};
            const name = argv.n || argv.name || argv._[2];
            const durationStr = argv.d || argv.duration || argv._[3];

            if (name) updates.name = name as string;
            if (durationStr) updates.duration = parseToMinutes(durationStr as string);

            const job = await dbService.updateJob(argv.id as string, updates);
            console.log(
              chalk.green(
                `Updated job "${job.name}" (${formatMinutes(job.duration)}) with ID: ${chalk.blue(job.id)}`
              )
            );
          } catch (error) {
            console.error(chalk.red(`Error: ${(error as Error).message}`));
          }
        },
      })
      .demandCommand(1, 'You need to specify a job command'),
  handler: () => {},
} satisfies CommandModule;

export default job; 