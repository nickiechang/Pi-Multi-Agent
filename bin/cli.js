#!/usr/bin/env node

const command = process.argv[2];

if (!command || command === 'help' || command === '--help' || command === '-h') {
  console.log(`
  Pi Multi-Agent - Production-grade Multi-Agent Framework

  Usage:
    npx pi-multi-agent server [options]    Start the API server
    npx pi-multi-agent help                Show this help message

  Server Options:
    --port <number>     Server port (default: 3001, or PORT env var)
    --env <path>        Path to .env file (default: .env in current directory)

  Environment Variables:
    DEEPSEEK_API_KEY    Required. Your DeepSeek API key
    PORT                Server port (default: 3001)

  Examples:
    DEEPSEEK_API_KEY=sk-xxx npx pi-multi-agent server
    npx pi-multi-agent server --port 8080
  `);
  process.exit(0);
}

if (command === 'server') {
  const args = process.argv.slice(3);
  let port;
  let envPath;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--env' && args[i + 1]) {
      envPath = args[i + 1];
      i++;
    }
  }

  if (port) process.env.PORT = String(port);

  if (envPath) {
    const fs = require('fs');
    const path = require('path');
    try {
      const content = fs.readFileSync(path.resolve(envPath), 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim();
        process.env[key] = value;
      }
    } catch (e) {
      console.error(`Failed to load .env file: ${e.message}`);
      process.exit(1);
    }
  }

  require('../dist/server.js');
} else {
  console.error(`Unknown command: ${command}`);
  console.error('Run "npx pi-multi-agent help" for usage information.');
  process.exit(1);
}
