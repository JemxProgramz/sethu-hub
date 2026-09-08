import { runAuthTests } from './backend/auth.test.js';
import { runPostsTests } from './backend/posts.test.js';
import { runAITests } from './ai/ai.test.js';

async function main() {
  console.log('===============================================================');
  console.log('🏛️  SETHU HUB — COMPREHENSIVE AUTOMATED TEST RUNNER');
  console.log('    "Where Sethu Connects."');
  console.log('===============================================================\n');

  try {
    await runAuthTests();
    await runPostsTests();
    await runAITests();

    console.log('===============================================================');
    console.log('🏆 ALL TEST SUITES PASSED (Auth, Security, Posts, 10 AI Agents)!');
    console.log('===============================================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:');
    console.error(err);
    process.exit(1);
  }
}

main();

