import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import { getProvider } from '../ai/providers.js';
import { getAPIKey, getDefaultProvider, getDefaultModel } from '../utils/config.js';

export async function project(description, options) {
  const provider = getDefaultProvider();
  const apiKey = getAPIKey(provider);

  if (!apiKey) {
    console.error(chalk.red(`❌ No API key found for provider: ${provider}`));
    console.error(chalk.yellow(`Run: sircli config set apiKeys.${provider} YOUR_API_KEY`));
    process.exit(1);
  }

  const model = getDefaultModel(provider);
  const ai = getProvider(provider, apiKey, model);

  const outputDir = options.output || `./${description.toLowerCase().replace(/\s+/g, '-')}`;

  let systemPrompt = `You are an expert software architect and developer. Generate a complete project structure with all necessary files.
Return your response as a JSON object with this structure:
{
  "files": [
    {"path": "relative/path/to/file", "content": "file content here"},
    ...
  ]
}`;

  let userPrompt = `Create a ${options.type || 'web'} project with the following description:\n\n${description}\n\nInclude all necessary files, configuration, and documentation.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const spinner = ora('Generating project...').start();

  try {
    const response = await ai.chat(messages, { maxTokens: 8000 });
    spinner.stop();

    const jsonMatch = response.match(/```json\n([\s\S]*?)```/) || response.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      console.log(chalk.cyan('\n📦 Project Plan:\n'));
      console.log(response);
      console.log('');
      console.log(chalk.yellow('⚠️  Unable to automatically generate files. Review the plan above.'));
      return;
    }

    const projectData = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    if (!projectData.files || !Array.isArray(projectData.files)) {
      throw new Error('Invalid project structure in response');
    }

    console.log(chalk.green(`\n✨ Creating project in: ${outputDir}\n`));

    await fs.mkdir(outputDir, { recursive: true });

    for (const file of projectData.files) {
      const filePath = path.join(outputDir, file.path);
      const fileDir = path.dirname(filePath);

      await fs.mkdir(fileDir, { recursive: true });
      await fs.writeFile(filePath, file.content);

      console.log(chalk.gray(`  ✓ Created: ${file.path}`));
    }

    console.log(chalk.green(`\n✅ Project created successfully!`));
    console.log(chalk.cyan(`📁 Location: ${path.resolve(outputDir)}`));
  } catch (error) {
    spinner.stop();
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}
