import axios from 'axios';

export class AIProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async chat(messages, options = {}) {
    throw new Error('Method not implemented');
  }
}

export class OpenAIProvider extends AIProvider {
  constructor(apiKey, model = 'gpt-4') {
    super(apiKey);
    this.model = model;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async chat(messages, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenAI API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class AnthropicProvider extends AIProvider {
  constructor(apiKey, model = 'claude-3-5-sonnet-20241022') {
    super(apiKey);
    this.model = model;
    this.baseURL = 'https://api.anthropic.com/v1';
  }

  async chat(messages, options = {}) {
    try {
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');

      const response = await axios.post(
        `${this.baseURL}/messages`,
        {
          model: this.model,
          messages: userMessages,
          system: systemMessage?.content,
          max_tokens: options.maxTokens || 4096,
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.content[0].text;
    } catch (error) {
      throw new Error(`Anthropic API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class GoogleProvider extends AIProvider {
  constructor(apiKey, model = 'gemini-pro') {
    super(apiKey);
    this.model = model;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async chat(messages, options = {}) {
    try {
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const response = await axios.post(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          contents,
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2048,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw new Error(`Google API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class OpenRouterProvider extends AIProvider {
  constructor(apiKey, model = 'anthropic/claude-3.5-sonnet') {
    super(apiKey);
    this.model = model;
    this.baseURL = 'https://openrouter.ai/api/v1';
  }

  async chat(messages, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://sircli.app',
            'X-Title': 'SirCLI',
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenRouter API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class GroqProvider extends AIProvider {
  constructor(apiKey, model = 'llama-3.1-70b-versatile') {
    super(apiKey);
    this.model = model;
    this.baseURL = 'https://api.groq.com/openai/v1';
  }

  async chat(messages, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Groq API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export function getProvider(providerName, apiKey, model) {
  const providers = {
    openai: OpenAIProvider,
    anthropic: AnthropicProvider,
    google: GoogleProvider,
    openrouter: OpenRouterProvider,
    groq: GroqProvider,
  };

  const ProviderClass = providers[providerName.toLowerCase()];
  if (!ProviderClass) {
    throw new Error(`Unknown provider: ${providerName}`);
  }

  return new ProviderClass(apiKey, model);
}
