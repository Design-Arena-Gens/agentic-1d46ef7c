# SirCLI

**SirCLI** - An advanced, AI-powered command-line interface designed for Termux. The evolution of all CLIs.

## Features

- 🤖 **Multi-AI Provider Support**: OpenAI, Anthropic, Google, OpenRouter, Groq, and more
- 💬 **Interactive Chat**: Conversational AI assistance
- 📝 **Code Generation**: Generate and modify code with AI
- 🚀 **Project Creation**: Create entire projects from descriptions
- 📁 **File Operations**: Create, read, write, and manage files
- 🔍 **Internet Search**: Search the web directly from CLI
- ⬇️ **Download Manager**: Download files from the internet
- ⚡ **Command Execution**: Execute shell commands and scripts
- ⚙️ **Configuration Management**: Easy API key and settings management

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Install from npm (once published)

```bash
npm install -g sircli
```

### Install from source

```bash
git clone https://github.com/yourusername/sircli.git
cd sircli
npm install
npm link
```

## Quick Start

### 1. Configure API Keys

Before using SirCLI, set up your API keys:

```bash
# OpenAI
sircli config set apiKeys.openai YOUR_OPENAI_API_KEY

# Anthropic
sircli config set apiKeys.anthropic YOUR_ANTHROPIC_API_KEY

# Google
sircli config set apiKeys.google YOUR_GOOGLE_API_KEY

# OpenRouter
sircli config set apiKeys.openrouter YOUR_OPENROUTER_API_KEY

# Groq
sircli config set apiKeys.groq YOUR_GROQ_API_KEY
```

### 2. Set Default Provider

```bash
sircli config set defaultProvider openai
```

### 3. View Configuration

```bash
sircli config list
```

## Usage

### Chat with AI

**Single message:**
```bash
sircli chat "Explain quantum computing"
```

**Interactive mode:**
```bash
sircli chat
```

**Specify provider and model:**
```bash
sircli chat -p anthropic -m claude-3-5-sonnet-20241022 "Hello!"
```

**With system prompt:**
```bash
sircli chat -s "You are a Python expert" "How do I use decorators?"
```

### Generate Code

**Generate code:**
```bash
sircli code "Create a function to calculate fibonacci numbers" -l python
```

**Modify existing file:**
```bash
sircli code "Add error handling" -f script.py -o script_improved.py
```

**Save to file:**
```bash
sircli code "Create a REST API server" -l javascript -o server.js
```

### Create Projects

**Create a project:**
```bash
sircli project "Todo app with React and Express backend" -t web
```

**Specify output directory:**
```bash
sircli project "CLI tool for file management" -t cli -o ./my-cli-tool
```

### File Operations

**Create a file:**
```bash
sircli file create hello.txt "Hello, World!"
```

**Read a file:**
```bash
sircli file read hello.txt
```

**Append to file:**
```bash
sircli file append hello.txt "More content"
```

**Delete a file:**
```bash
sircli file delete hello.txt
```

**Create directory:**
```bash
sircli file mkdir new-folder
```

**List directory:**
```bash
sircli file list .
```

### Search the Internet

```bash
sircli search "latest AI developments"
```

**Limit results:**
```bash
sircli search "Python tutorials" -n 10
```

### Download Files

```bash
sircli download https://example.com/file.zip
```

**Specify output path:**
```bash
sircli download https://example.com/image.jpg -o ./downloads/image.jpg
```

### Execute Commands

```bash
sircli execute "ls -la"
```

**Change working directory:**
```bash
sircli execute "npm install" -d ./my-project
```

**Use different shell:**
```bash
sircli execute "Get-Process" -s powershell
```

## Configuration

### Configuration Keys

- `apiKeys.openai` - OpenAI API key
- `apiKeys.anthropic` - Anthropic API key
- `apiKeys.google` - Google AI API key
- `apiKeys.openrouter` - OpenRouter API key
- `apiKeys.groq` - Groq API key
- `defaultProvider` - Default AI provider (openai, anthropic, google, etc.)
- `defaultModels.openai` - Default OpenAI model
- `defaultModels.anthropic` - Default Anthropic model

### Configuration Commands

```bash
# Set a value
sircli config set <key> <value>

# Get a value
sircli config get <key>

# List all configuration
sircli config list

# Delete a key
sircli config delete <key>
```

## Supported AI Providers

| Provider | Models | API Key Required |
|----------|--------|------------------|
| OpenAI | GPT-4, GPT-3.5-turbo | Yes |
| Anthropic | Claude 3.5 Sonnet, Claude 3 Opus | Yes |
| Google | Gemini Pro, Gemini Pro Vision | Yes |
| OpenRouter | Multiple models from various providers | Yes |
| Groq | Llama, Mixtral, Gemma | Yes |

## Examples

### Create a Web App

```bash
sircli project "E-commerce website with shopping cart" -t web -o ./ecommerce
```

### AI-Powered Code Review

```bash
sircli code "Review and improve this code" -f mycode.js
```

### Research and Summarize

```bash
sircli chat "Search for the latest developments in quantum computing and summarize them"
```

### Automate Tasks

```bash
sircli execute "git add . && git commit -m 'Update' && git push"
```

## Termux Usage

SirCLI works perfectly on Termux without root privileges:

```bash
# Install Node.js on Termux
pkg install nodejs

# Install SirCLI
npm install -g sircli

# Start using
sircli chat "Hello from Termux!"
```

## Tips

1. **Save API costs**: Use less expensive models for simple tasks
2. **Interactive mode**: Use `sircli chat` without arguments for conversations
3. **Combine commands**: Use with shell pipes and scripting
4. **Project templates**: Create custom project types for repeated use
5. **Configuration**: Store commonly used settings in config

## Troubleshooting

### "No API key found"

Set your API key:
```bash
sircli config set apiKeys.openai YOUR_API_KEY
```

### "Module not found"

Reinstall dependencies:
```bash
npm install
```

### Permission errors on Termux

Ensure storage permissions:
```bash
termux-setup-storage
```

## License

MIT License - feel free to use and modify!

## Contributing

Contributions are welcome! Please open issues and pull requests.

## Support

For issues and questions, please open a GitHub issue.
