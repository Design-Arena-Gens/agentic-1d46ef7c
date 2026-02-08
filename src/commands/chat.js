import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { getProvider } from '../ai/providers.js';
import { getAPIKey, getDefaultProvider, getDefaultModel } from '../utils/config.js';

export async function chat(message, options) {
  const provider = options.provider || getDefaultProvider();
  const apiKey = getAPIKey(provider);

  if (!apiKey) {
    console.error(chalk.red(`❌ No API key found for provider: ${provider}`));
    console.error(chalk.yellow(`Run: sircli config set apiKeys.${provider} YOUR_API_KEY`));
    process.exit(1);
  }

  const model = options.model || getDefaultModel(provider);
  const ai = getProvider(provider, apiKey, model);

  const messages = [];

  if (options.system) {
    messages.push({ role: 'system', content: options.system });
  }

  if (message) {
    messages.push({ role: 'user', content: message });
    await sendMessage(ai, messages);
  } else {
    await interactiveChat(ai, messages);
  }
}

async function sendMessage(ai, messages) {
  const spinner = ora('Thinking...').start();

  try {
    const response = await ai.chat(messages);
    spinner.stop();
    console.log(chalk.cyan('\n🤖 Assistant:\n'));
    console.log(response);
    console.log('');
  } catch (error) {
    spinner.stop();
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
  }
}

async function interactiveChat(ai, messages) {
  console.log(chalk.green('💬 Interactive Chat Mode'));
  console.log(chalk.gray('Type "exit" or "quit" to end the conversation\n'));

  while (true) {
    const { userMessage } = await inquirer.prompt([
      {
        type: 'input',
        name: 'userMessage',
        message: chalk.blue('You:'),
        prefix: '',
      },
    ]);

    if (['exit', 'quit', 'q'].includes(userMessage.toLowerCase().trim())) {
      console.log(chalk.yellow('\n👋 Goodbye!'));
      break;
    }

    if (!userMessage.trim()) {
      continue;
    }

    messages.push({ role: 'user', content: userMessage });

    const spinner = ora('Thinking...').start();

    try {
      const response = await ai.chat(messages);
      spinner.stop();

      messages.push({ role: 'assistant', content: response });

      console.log(chalk.cyan('\n🤖 Assistant:\n'));
      console.log(response);
      console.log('');
    } catch (error) {
      spinner.stop();
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
    }
  }
}
