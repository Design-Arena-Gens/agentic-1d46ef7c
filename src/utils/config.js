import Conf from 'conf';

const config = new Conf({
  projectName: 'sircli',
});

export function getConfig(key) {
  return config.get(key);
}

export function setConfig(key, value) {
  config.set(key, value);
}

export function deleteConfig(key) {
  config.delete(key);
}

export function getAllConfig() {
  return config.store;
}

export function getAPIKey(provider) {
  const key = `apiKeys.${provider}`;
  return config.get(key);
}

export function setAPIKey(provider, apiKey) {
  const key = `apiKeys.${provider}`;
  config.set(key, apiKey);
}

export function getDefaultProvider() {
  return config.get('defaultProvider') || 'openai';
}

export function getDefaultModel(provider) {
  return config.get(`defaultModels.${provider}`);
}

export default config;
