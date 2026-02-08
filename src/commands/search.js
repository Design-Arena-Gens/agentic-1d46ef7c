import chalk from 'chalk';
import ora from 'ora';
import axios from 'axios';

export async function search(query, options) {
  const numResults = parseInt(options.num) || 5;
  const spinner = ora('Searching...').start();

  try {
    // Using DuckDuckGo HTML search (no API key required)
    const response = await axios.get('https://html.duckduckgo.com/html/', {
      params: {
        q: query,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      },
    });

    spinner.stop();

    // Parse basic results from HTML (simplified)
    const results = parseSearchResults(response.data, numResults);

    if (results.length === 0) {
      console.log(chalk.yellow('No results found'));
      return;
    }

    console.log(chalk.cyan(`\n🔍 Search Results for: "${query}"\n`));

    results.forEach((result, index) => {
      console.log(chalk.green(`${index + 1}. ${result.title}`));
      console.log(chalk.gray(`   ${result.url}`));
      if (result.snippet) {
        console.log(chalk.white(`   ${result.snippet}`));
      }
      console.log('');
    });
  } catch (error) {
    spinner.stop();
    console.error(chalk.red(`❌ Search Error: ${error.message}`));
    console.log(chalk.yellow('\n💡 Alternative: Use "sircli chat" with web search enabled'));
  }
}

function parseSearchResults(html, limit) {
  const results = [];
  const titleRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gs;
  const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>(.*?)<\/a>/gs;

  let match;
  let count = 0;

  while ((match = titleRegex.exec(html)) !== null && count < limit) {
    const url = match[1].replace(/^\/\/duckduckgo\.com\/l\/\?uddg=/, '').split('&')[0];
    const title = match[2].replace(/<[^>]*>/g, '').trim();

    const snippetMatch = snippetRegex.exec(html);
    const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').trim() : '';

    if (url && title) {
      results.push({
        title: decodeURIComponent(title),
        url: decodeURIComponent(url),
        snippet: decodeURIComponent(snippet),
      });
      count++;
    }
  }

  // Fallback simple results if parsing fails
  if (results.length === 0) {
    results.push({
      title: 'Search completed',
      url: `https://duckduckgo.com/?q=${encodeURIComponent(html.substring(0, 100))}`,
      snippet: 'Visit DuckDuckGo for full results',
    });
  }

  return results;
}
