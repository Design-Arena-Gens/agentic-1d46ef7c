#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { chat } from '../src/commands/chat.js';
import { code } from '../src/commands/code.js';
import { project } from '../src/commands/project.js';
import { file } from '../src/commands/file.js';
import { search } from '../src/commands/search.js';
import { download } from '../src/commands/download.js';
import { execute } from '../src/commands/execute.js';
import { config } from '../src/commands/config.js';

const program = new Command();

program
  .name('sircli')
  .description('SirCLI - Advanced AI-powered CLI for Termux')
  .version('1.0.0');

program
  .command('chat')
  .description('Interactive chat with AI models')
  .option('-m, --model <model>', 'AI model to use (gpt-4, claude, gemini, etc.)')
  .option('-p, --provider <provider>', 'AI provider (openai, anthropic, google, etc.)')
  .option('-s, --system <prompt>', 'System prompt')
  .argument('[message]', 'Message to send')
  .action(chat);

program
  .command('code')
  .description('Generate or modify code')
  .option('-l, --language <lang>', 'Programming language')
  .option('-f, --file <path>', 'File to modify')
  .option('-o, --output <path>', 'Output file path')
  .argument('<prompt>', 'Code generation prompt')
  .action(code);

program
  .command('project')
  .description('Create entire project from description')
  .option('-t, --type <type>', 'Project type (web, cli, api, etc.)')
  .option('-o, --output <path>', 'Output directory')
  .argument('<description>', 'Project description')
  .action(project);

program
  .command('file')
  .description('File operations (create, read, write, delete)')
  .argument('<operation>', 'Operation: create, read, write, delete, append')
  .argument('<path>', 'File path')
  .argument('[content]', 'Content for write/append operations')
  .action(file);

program
  .command('search')
  .description('Search the internet')
  .option('-n, --num <number>', 'Number of results', '5')
  .argument('<query>', 'Search query')
  .action(search);

program
  .command('download')
  .description('Download files from the internet')
  .option('-o, --output <path>', 'Output file path')
  .argument('<url>', 'URL to download')
  .action(download);

program
  .command('execute')
  .description('Execute shell commands or scripts')
  .option('-s, --shell <shell>', 'Shell to use', 'bash')
  .option('-d, --dir <directory>', 'Working directory')
  .argument('<command>', 'Command to execute')
  .action(execute);

program
  .command('config')
  .description('Configure API keys and settings')
  .argument('<action>', 'Action: set, get, list, delete')
  .argument('[key]', 'Configuration key')
  .argument('[value]', 'Configuration value')
  .action(config);

program.parse();
