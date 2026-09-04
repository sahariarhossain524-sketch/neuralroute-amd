import type { PromptComplexity } from '../types';

export function analyzePromptComplexity(prompt: string): PromptComplexity {
  if (!prompt || !prompt.trim()) {
    return {
      score: 0.05,
      level: 'SIMPLE',
      domain: 'FACTUAL',
      estimatedTokens: 0,
      requiresFrontier: false,
      reasons: ['Empty or minimal prompt']
    };
  }

  const trimmed = prompt.trim();
  const charCount = trimmed.length;
  const estimatedTokens = Math.ceil(charCount / 3.7);
  const lower = trimmed.toLowerCase();
  const reasons: string[] = [];

  let score = 0.15; // Normalized baseline

  // 1. Code Block & Syntax Detection
  const hasCodeBlocks = /```[\s\S]*?```/.test(trimmed);
  const hasCodeKeywords = /(\bdef\b|\bfunction\b|\bclass\b|\bimport\b|\bstruct\b|\bhipLaunchKernelGGL\b|\brocm\b|\bhip\b|\btorch\b|=>|{|};)/i.test(lower);
  
  if (hasCodeBlocks || hasCodeKeywords) {
    score += 0.20;
    reasons.push('Code implementation / ROCm programming syntax detected');
  }

  // 2. High-Order Multi-Step Reasoning & Derivations
  const hasReasoning = /(\bderive\b|\bderivation\b|\bprove\b|\bproof\b|\bcalculate\b|\bwhy\b|\bstep-by-step\b|\bstrategy\b|\banalyze\b|\bbenchmark\b)/i.test(lower);
  if (hasReasoning) {
    score += 0.25;
    reasons.push('Multi-step analytical reasoning / formal derivation requested');
  }

  // 3. Advanced Frontier / Extreme Complexity Triggers
  const hasFrontierTrigger = /(\bformal proof\b|\bmathematical proof\b|\bstochastic\b|\bequilibrium\b|\bjump diffusion\b|\bpartial differential\b)/i.test(lower);
  if (hasFrontierTrigger) {
    score += 0.25;
    reasons.push('Advanced frontier capability / theoretical proof requested');
  }

  // 4. Quantitative & Data Context
  const hasData = /(\bdataset\b|\bcsv\b|\bdataframe\b|\bvolatility\b|\bsharpe\b|\bcorrelation matrix\b)/i.test(lower);
  if (hasData) {
    score += 0.15;
    reasons.push('Quantitative data analysis context');
  }

  // 5. Token Length Burden Scaling
  if (estimatedTokens > 1000) {
    score += 0.30;
    reasons.push('Large context (>1K tokens) requiring extended KV cache');
  } else if (estimatedTokens > 150) {
    score += 0.15;
    reasons.push('Moderate context length');
  }

  // Strict Normalization to [0.05, 0.98]
  score = Math.min(0.98, Math.max(0.05, Number(score.toFixed(2))));

  // Exact 0.65 Threshold Determination
  const requiresFrontier = score >= 0.65;

  let level: PromptComplexity['level'] = 'SIMPLE';
  if (score >= 0.85) level = 'EXTREME';
  else if (score >= 0.65) level = 'COMPLEX';
  else if (score >= 0.35) level = 'MODERATE';

  let domain: PromptComplexity['domain'] = 'FACTUAL';
  if (hasCodeBlocks || hasCodeKeywords) domain = 'CODE';
  else if (hasReasoning || hasFrontierTrigger) domain = 'REASONING';
  else if (hasData) domain = 'DATA_ANALYSIS';
  else if (/(\bpoem\b|\bstory\b|\bcreative\b|\bmetaphor\b)/i.test(lower)) domain = 'CREATIVE';

  return {
    score,
    level,
    domain,
    estimatedTokens,
    requiresFrontier,
    reasons
  };
}
