import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

export async function file(operation, filePath, content) {
  const resolvedPath = path.resolve(filePath);

  try {
    switch (operation.toLowerCase()) {
      case 'create':
      case 'write':
        await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
        await fs.writeFile(resolvedPath, content || '');
        console.log(chalk.green(`✅ File created: ${resolvedPath}`));
        break;

      case 'read':
        const readContent = await fs.readFile(resolvedPath, 'utf-8');
        console.log(chalk.cyan(`\n📄 Content of ${filePath}:\n`));
        console.log(readContent);
        break;

      case 'append':
        await fs.appendFile(resolvedPath, content || '');
        console.log(chalk.green(`✅ Content appended to: ${resolvedPath}`));
        break;

      case 'delete':
        await fs.unlink(resolvedPath);
        console.log(chalk.green(`✅ File deleted: ${resolvedPath}`));
        break;

      case 'mkdir':
        await fs.mkdir(resolvedPath, { recursive: true });
        console.log(chalk.green(`✅ Directory created: ${resolvedPath}`));
        break;

      case 'list':
      case 'ls':
        const files = await fs.readdir(resolvedPath);
        console.log(chalk.cyan(`\n📁 Contents of ${filePath}:\n`));
        files.forEach(file => console.log(`  ${file}`));
        break;

      default:
        console.error(chalk.red(`❌ Unknown operation: ${operation}`));
        console.log(chalk.yellow('Available operations: create, read, write, append, delete, mkdir, list'));
        process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
    process.exit(1);
  }
}
