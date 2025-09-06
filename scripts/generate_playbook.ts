#!/usr/bin/env node
import { renderPlaybooks } from './scenario_engine.js';

const out = process.argv[2] || 'docs/generated';
renderPlaybooks(out).catch((err) => {
  console.error(err);
  process.exit(1);
});
