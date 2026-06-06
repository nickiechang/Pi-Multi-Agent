// models.config.ts — Multi-model provider configuration for Pi-Multi-Agent
// Copy this file and fill in your API keys, then run with:
//   DEEPSEEK_API_KEY=sk-... npx tsx server/index.ts

import type { ModelProvidersConfig } from './src/models/config.js';

export const exampleModelProvidersConfig: ModelProvidersConfig = {
  providers: [
    {
      id: 'deepseek',
      displayName: 'DeepSeek',
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env['DEEPSEEK_API_KEY'] ?? '',
      isDefault: true,
    },
    // Uncomment and configure to add more providers:
    // {
    //   id: 'openai',
    //   displayName: 'OpenAI',
    //   baseURL: 'https://api.openai.com',
    //   apiKey: process.env['OPENAI_API_KEY'] ?? '',
    // },
    // {
    //   id: 'anthropic',
    //   displayName: 'Anthropic',
    //   baseURL: 'https://api.anthropic.com',
    //   apiKey: process.env['ANTHROPIC_API_KEY'] ?? '',
    // },
  ],
  models: [
    // DeepSeek models (small/light model — good for simple tasks, chat, planning)
    {
      id: 'deepseek-chat',
      provider: 'deepseek',
      displayName: 'DeepSeek Chat',
      complexity: 'light',
      specialties: ['chat', 'general', 'planning'],
      tags: ['tools'],
      contextWindow: 64000,
      maxOutputTokens: 4096,
      pricingPer1kInput: 0.0014,
      pricingPer1kOutput: 0.0028,
    },
    // DeepSeek Reasoner (heavy model — good for reasoning, evaluation, complex analysis)
    {
      id: 'deepseek-reasoner',
      provider: 'deepseek',
      displayName: 'DeepSeek Reasoner',
      complexity: 'heavy',
      specialties: ['reasoning', 'analysis'],
      contextWindow: 64000,
      maxOutputTokens: 4096,
      pricingPer1kInput: 0.004,
      pricingPer1kOutput: 0.016,
    },
    // Uncomment to add more models:
    // {
    //   id: 'gpt-4o',
    //   provider: 'openai',
    //   displayName: 'GPT-4o',
    //   complexity: 'heavy',
    //   specialties: ['chat', 'reasoning', 'vision', 'writing'],
    //   tags: ['tools'],
    //   contextWindow: 128000,
    //   maxOutputTokens: 16384,
    //   pricingPer1kInput: 0.005,
    //   pricingPer1kOutput: 0.015,
    // },
    // {
    //   id: 'gpt-4o-mini',
    //   provider: 'openai',
    //   displayName: 'GPT-4o Mini',
    //   complexity: 'light',
    //   specialties: ['chat'],
    //   tags: ['tools'],
    //   contextWindow: 128000,
    //   maxOutputTokens: 16384,
    //   pricingPer1kInput: 0.00015,
    //   pricingPer1kOutput: 0.0006,
    // },
  ],
};
