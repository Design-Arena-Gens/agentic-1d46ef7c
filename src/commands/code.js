import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import { getProvider } from '../ai/providers.js';
import { getAPIKey, getDefaultProvider, getDefaultModel } from '../utils/config.js';

export async function code(promptText, options) {
  const provider = getDefaultProvider();
  const apiKey = getAPIKey(provider);

  if (!apiKey) {
    console.error(chalk.red(`❌ No API key found for provider: ${provider}`));
    console.error(chalk.yellow(`Run: sircli config set apiKeys.${provider} YOUR_API_KEY`));
    process.exit(1);
  }

  const model = getDefaultModel(provider);
  const ai = getProvider(provider, apiKey, model);

  let systemPrompt = 'You are an expert programmer. Generate clean, efficient, and well-documented code.';
  let userPrompt = promptText;

  if (options.language) {
    systemPrompt += ` Generate code in ${options.language}.`;
  }

  if (options.file) {
    try {
      const fileContent = await fs.readFile(options.file, 'utf-8');
      userPrompt = `Here's the current code:\n\n\`\`\`\n${fileContent}\n\`\`\`\n\n${promptText}`;
    } catch (error) {
      console.error(chalk.red(`❌ Error reading file: ${error.message}`));
      process.exit(1);
    }
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const spinner = ora('Generating code...').start();

  try {
    const response = await ai.chat(messages, { maxTokens: 4096 });
    spinner.stop();

    console.log(chalk.cyan('\n📝 Generated Code:\n'));
    console.log(response);
    console.log('');

    if (options.output) {
      const outputPath = path.resolve(options.output);
      const codeMatch = response.match(/```(?:\w+)?\n([\s\S]*?)```/);
      const codeToWrite = codeMatch ? codeMatch[1] : response;

      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, codeToWrite.trim());
      console.log(chalk.green(`✅ Code saved to: ${outputPath}`));
    }
  } catch (error) {
    spinner.stop();
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}
