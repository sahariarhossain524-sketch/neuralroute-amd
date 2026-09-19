import test from 'node:test';
import assert from 'node:assert';
import { analyzePromptComplexity } from '../src/lib/router/classifier.ts';
import { routePrompt, REGISTERED_MODELS } from '../src/lib/router/engine.ts';
import { getAmdGpuTelemetry } from '../src/lib/router/telemetry.ts';

// 1, 2, 3: Classifier Tests
test('Classifier: identifies coding syntax and ROCm keywords', () => {
  const codePrompt = 'Write a PyTorch custom HIP kernel for matrix multiplication with torch.cuda and rocm';
  const analysis = analyzePromptComplexity(codePrompt);
  assert.strictEqual(analysis.domain, 'CODE');
  assert.ok(analysis.score >= 0.35);
  assert.ok(analysis.reasons.some((r) => r.includes('programming')));
});

test('Classifier: marks concise factual query as SIMPLE or MODERATE', () => {
  const simplePrompt = 'What is the capital of Bangladesh?';
  const analysis = analyzePromptComplexity(simplePrompt);
  assert.strictEqual(analysis.domain, 'FACTUAL');
  assert.strictEqual(analysis.level, 'SIMPLE');
  assert.strictEqual(analysis.requiresFrontier, false);
});

test('Classifier: detects formal proof and assigns high complexity', () => {
  const proofPrompt = 'Formulate a formal proof for Black-Scholes PDE with boundary conditions and step-by-step derivation';
  const analysis = analyzePromptComplexity(proofPrompt);
  assert.ok(analysis.score >= 0.50);
  assert.strictEqual(analysis.domain, 'REASONING');
});

// 4, 5, 6: Engine Routing & Economics Tests
test('Engine: routes developer code prompt to local AMD ROCm MI300X', () => {
  const codePrompt = 'Write a python function to benchmark AMD GPU tensor operations';
  const decision = routePrompt(codePrompt, 'COST_OPTIMIZED');
  assert.strictEqual(decision.selectedModel.id, 'amd-llama3-8b-mi300x');
  assert.strictEqual(decision.selectedModel.isLocalAMD, true);
  assert.strictEqual(decision.selectedModel.singleStreamTokensPerSec, 154);
  assert.strictEqual(decision.baselineHardwareTtftMs, 18);
  assert.ok(decision.routingOverheadMs < 2.0, 'Router CPU overhead must be sub-2ms');
  assert.ok(decision.percentSaved > 50);
  assert.ok(decision.dollarSaved > 0);
});

test('Engine: routes extreme proof to Frontier Cloud under default policy', () => {
  const longProof = 'formal proof mathematical derivation '.repeat(20);
  const decision = routePrompt(longProof, 'COST_OPTIMIZED');
  assert.strictEqual(decision.selectedModel.isLocalAMD, false);
  assert.strictEqual(decision.selectedModel.id, 'frontier-cloud-large');
});

test('Engine: LATENCY_FIRST policy aggressively favors AMD ROCm', () => {
  const mediumPrompt = 'Analyze this dataset and calculate the mean and standard deviation step-by-step';
  const decision = routePrompt(mediumPrompt, 'LATENCY_FIRST');
  assert.strictEqual(decision.selectedModel.isLocalAMD, true);
  assert.ok(decision.executionTimeMs < 50);
});

// 7, 8: Hardware Telemetry Tests
test('Telemetry: returns valid AMD Instinct MI300X specs and ROCm 6.2 telemetry', () => {
  const tel = getAmdGpuTelemetry();
  assert.strictEqual(tel.totalVramGB, 192);
  assert.strictEqual(tel.memoryBandwidthTBps, 5.3);
  assert.strictEqual(tel.computeUnits, 304);
  assert.ok(tel.rocmVersion.includes('ROCm v6.2'));
  assert.ok(tel.currentThroughputTokensSec > 100);
});
