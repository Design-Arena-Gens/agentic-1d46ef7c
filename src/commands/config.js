import chalk from 'chalk';
import { getConfig, setConfig, deleteConfig, getAllConfig } from '../utils/config.js';

export async function config(action, key, value) {
  try {
    switch (action.toLowerCase()) {
      case 'set':
        if (!key || value === undefined) {
          console.error(chalk.red('❌ Usage: sircli config set <key> <value>'));
          process.exit(1);
        }
        setConfig(key, value);
        console.log(chalk.green(`✅ Set ${key} = ${maskSensitive(key, value)}`));
        break;

      case 'get':
        if (!key) {
          console.error(chalk.red('❌ Usage: sircli config get <key>'));
          process.exit(1);
        }
        const val = getConfig(key);
        if (val === undefined) {
          console.log(chalk.yellow(`⚠️  Key not found: ${key}`));
        } else {
          console.log(chalk.cyan(`${key} = ${maskSensitive(key, val)}`));
        }
        break;

      case 'delete':
      case 'remove':
        if (!key) {
          console.error(chalk.red('❌ Usage: sircli config delete <key>'));
          process.exit(1);
        }
        deleteConfig(key);
        console.log(chalk.green(`✅ Deleted ${key}`));
        break;

      case 'list':
      case 'show':
        const allConfig = getAllConfig();
        console.log(chalk.cyan('\n⚙️  Configuration:\n'));

        if (Object.keys(allConfig).length === 0) {
          console.log(chalk.gray('  No configuration set'));
          console.log(chalk.yellow('\n💡 Example: sircli config set apiKeys.openai YOUR_API_KEY'));
        } else {
          displayConfig(allConfig);
        }
        console.log('');
        break;

      default:
        console.error(chalk.red(`❌ Unknown action: ${action}`));
        console.log(chalk.yellow('Available actions: set, get, delete, list'));
        process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
    process.exit(1);
  }
}

function displayConfig(obj, prefix = '') {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      displayConfig(value, fullKey);
    } else {
      console.log(chalk.white(`  ${fullKey} = ${maskSensitive(fullKey, value)}`));
    }
  }
}

function maskSensitive(key, value) {
  const sensitiveKeys = ['key', 'token', 'secret', 'password', 'api'];

  if (typeof value === 'string' && sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
    if (value.length <= 8) {
      return '****';
    }
    return value.substring(0, 4) + '****' + value.substring(value.length - 4);
  }

  return value;
}
