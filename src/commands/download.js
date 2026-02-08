import chalk from 'chalk';
import ora from 'ora';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

export async function download(url, options) {
  const filename = options.output || path.basename(new URL(url).pathname) || 'download';
  const outputPath = path.resolve(filename);

  const spinner = ora(`Downloading ${url}...`).start();

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      },
    });

    const totalSize = parseInt(response.headers['content-length'], 10);
    let downloadedSize = 0;

    response.data.on('data', (chunk) => {
      downloadedSize += chunk.length;
      if (totalSize) {
        const percent = ((downloadedSize / totalSize) * 100).toFixed(1);
        spinner.text = `Downloading ${filename}... ${percent}%`;
      }
    });

    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
    await pipeline(response.data, fs.createWriteStream(outputPath));

    spinner.succeed(chalk.green(`✅ Downloaded: ${outputPath}`));

    const stats = await fs.promises.stat(outputPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(chalk.gray(`   Size: ${sizeInMB} MB`));
  } catch (error) {
    spinner.fail(chalk.red(`❌ Download failed: ${error.message}`));
    process.exit(1);
  }
}
