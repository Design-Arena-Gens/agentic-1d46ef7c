import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function execute(command, options) {
  console.log(chalk.cyan(`⚡ Executing: ${command}\n`));

  try {
    const execOptions = {
      cwd: options.dir || process.cwd(),
      shell: options.shell || '/bin/bash',
      maxBuffer: 10 * 1024 * 1024, // 10MB
    };

    const { stdout, stderr } = await execAsync(command, execOptions);

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(chalk.yellow(stderr));
    }

    console.log(chalk.green('\n✅ Command completed successfully'));
  } catch (error) {
    console.error(chalk.red(`\n❌ Command failed with exit code ${error.code}`));

    if (error.stdout) {
      console.log('\nStdout:');
      console.log(error.stdout);
    }

    if (error.stderr) {
      console.error('\nStderr:');
      console.error(chalk.red(error.stderr));
    }

    process.exit(error.code || 1);
  }
}
