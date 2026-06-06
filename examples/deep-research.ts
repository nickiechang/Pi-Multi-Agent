import { AgentCluster } from '../src/orchestration/agent-cluster.js';
import { DeepPlanner } from '../src/orchestration/deep-planner.js';
import { loadModelProvidersConfig, createDefaultModelProvidersConfig } from '../src/models/loader.js';
import { ModelRegistry, MultiModelClient } from '../src/models/index.js';

const API_KEY = process.env.DEEPSEEK_API_KEY;
if (!API_KEY) {
  console.error('Error: DEEPSEEK_API_KEY environment variable is required');
  process.exit(1);
}

function buildRegistry(): ModelRegistry {
  const registry = new ModelRegistry();
  let config;
  try {
    config = loadModelProvidersConfig({
      defaultPaths: [
        require('path').resolve(process.cwd(), 'models.config.ts'),
        require('path').resolve(process.cwd(), 'models.config.json'),
      ],
    });
  } catch {
    config = createDefaultModelProvidersConfig();
  }
  for (const provider of config.providers) {
    if (!provider.apiKey) continue;
    registry.registerProvider({
      id: provider.id,
      displayName: provider.displayName,
      baseURL: provider.baseURL,
      apiKey: provider.apiKey,
      isDefault: provider.isDefault,
    });
  }
  for (const model of config.models) {
    registry.registerModel({ id: model.id, provider: model.provider });
  }
  return registry;
}

async function main() {
  const task = process.argv[2] || 'Complete a comprehensive market research report on the current state and future trends of AI Agent technology';
  const registry = buildRegistry();

  console.log('Pi Multi-Agent - Deep Research Example\n');
  console.log(`Task: ${task}\n`);

  const planner = new DeepPlanner({ registry });
  console.log('Creating execution plan...');
  const plan = await planner.createDeepPlan(task, {
    targetWordCount: 30000,
    maxAgents: 8,
    depth: 2,
  });

  console.log(`Plan created: ${plan.subTasks.length} subtasks, mode: ${plan.collaborationMode}`);
  for (const st of plan.subTasks) {
    console.log(`  - [${st.priority}] ${st.title} → ${st.assignedAgentName} (${st.assignedAgentType})`);
  }

  const cluster = new AgentCluster({ registry }, 'deep-research-session');

  cluster.onEvent((event) => {
    const data = event.data as Record<string, unknown>;
    switch (event.type) {
      case 'task_started':
        console.log(`  ▶ ${event.agentName}: ${data?.task || 'starting'}`);
        break;
      case 'tool_call':
        console.log(`    🔧 Tool: ${data?.toolName}`);
        break;
      case 'task_completed':
        console.log(`  ✓ ${event.agentName}: completed (${data?.outputLength || 0} chars)`);
        break;
      case 'task_failed':
        console.log(`  ✗ ${event.agentName}: failed - ${data?.error || 'unknown'}`);
        break;
      case 'evaluation':
        console.log(`  📊 Evaluation: ${(((data?.score as number) || 0) * 100).toFixed(0)}%`);
        break;
    }
  });

  console.log('\nExecuting plan...\n');
  const result = await cluster.executePlan(plan, 3);

  console.log('\n' + '='.repeat(60));
  console.log('Execution Complete');
  console.log('='.repeat(60));
  console.log(`Success: ${result.success}`);
  console.log(`Total Time: ${(result.totalExecutionTime / 1000).toFixed(1)}s`);
  console.log(`Total Tokens: ${result.totalTokensUsed.toLocaleString()}`);
  console.log(`Evaluation Score: ${(result.evaluationScore * 100).toFixed(0)}%`);
  console.log(`Iterations: ${result.iterations}`);
  console.log(`Report Length: ${result.finalOutput.length.toLocaleString()} chars`);

  if (process.env.OUTPUT_FILE) {
    const fs = await import('fs');
    await fs.promises.writeFile(process.env.OUTPUT_FILE, result.finalOutput, 'utf-8');
    console.log(`\nReport saved to: ${process.env.OUTPUT_FILE}`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
