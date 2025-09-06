#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import YAML from 'yaml';
import Ajv from 'ajv';
import Handlebars from 'handlebars';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMA_PATH = path.resolve(process.cwd(), 'docs/SCHEMA/scenario.schema.json');
const TEMPLATE_PATH = path.resolve(process.cwd(), 'docs/PLAYBOOK_TEMPLATES/playbook.md.hbs');
const GENERATED_DIR = path.resolve(process.cwd(), 'docs/generated');
const TELEMETRY_DIR = path.resolve(process.cwd(), '.telemetry');
const TOOLBOX_CONFIG = path.resolve(process.cwd(), 'AMP_TOOLBOX/toolbox.config.json');

async function loadSchema() {
  const raw = await fs.readFile(SCHEMA_PATH, 'utf8');
  return JSON.parse(raw);
}

export type Scenario = {
  id: string;
  title: string;
  level?: string;
  project: string;
  prerequisites?: string[];
  problem_statement?: string;
  solution_summary?: string;
  flow: Array<{ step: string; description: string; tool?: string; args?: string[] }>;
  value_proof: { metrics: Array<{ name: string; target: unknown }> };
  talk_track?: string;
  toolbox?: string[];
  estimated_duration_min?: number;
};

async function discoverScenarioFiles(): Promise<string[]> {
  const files = await glob('projects/**/scenario.yml', { cwd: process.cwd(), absolute: true });
  return files.sort();
}

async function loadScenariosFromFile(filePath: string): Promise<Scenario[]> {
  const raw = await fs.readFile(filePath, 'utf8');
  const doc = YAML.parse(raw);
  if (Array.isArray(doc)) return doc as Scenario[];
  return [doc as Scenario];
}

async function loadAllScenarios(): Promise<{ file: string; scenario: Scenario }[]> {
  const files = await discoverScenarioFiles();
  const items: { file: string; scenario: Scenario }[] = [];
  for (const f of files) {
    const list = await loadScenariosFromFile(f);
    for (const s of list) items.push({ file: f, scenario: s });
  }
  return items;
}

type ToolboxEntry = { name: string; command: string };
async function loadToolboxConfig(): Promise<ToolboxEntry[]> {
  try {
    const raw = await fs.readFile(TOOLBOX_CONFIG, 'utf8');
    const parsed = JSON.parse(raw);
    return (parsed.tools ?? []) as ToolboxEntry[];
  } catch (e) {
    return [];
  }
}

async function loadToolboxRegistry(): Promise<Set<string>> {
  const cfg = await loadToolboxConfig();
  return new Set(cfg.map(t => t.name));
}

export async function validateScenarios(): Promise<boolean> {
  const schema = await loadSchema();
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const registry = await loadToolboxRegistry();

  const entries = await loadAllScenarios();
  let ok = true;

  // Unique ID check
  const seen = new Map<string, string>();
  for (const { file, scenario } of entries) {
    if (seen.has(scenario.id)) {
      ok = false;
      const other = seen.get(scenario.id);
      console.error(chalk.red(`Duplicate scenario id '${scenario.id}' in:`));
      console.error(` - ${other}`);
      console.error(` - ${file}`);
    } else {
      seen.set(scenario.id, file);
    }
  }

  for (const { file, scenario } of entries) {
    const valid = validate(scenario);
    if (!valid) {
      ok = false;
      console.error(chalk.yellow(`Schema errors in ${file} (${scenario.id}):`));
      for (const err of validate.errors ?? []) {
        console.error(`  - ${err.instancePath} ${err.message}`);
      }
    }

    if (scenario.toolbox && scenario.toolbox.length > 0) {
      const unknown = scenario.toolbox.filter((t) => !registry.has(t));
      if (unknown.length > 0) {
        ok = false;
        console.error(chalk.yellow(`Unknown toolbox tools in ${file} (${scenario.id}): ${unknown.join(', ')}`));
      }
    }

    // Basic talk_track existence check
    if (scenario.talk_track) {
      const talkPath = path.resolve(path.dirname(file), scenario.talk_track);
      if (!(await fs.pathExists(talkPath))) {
        ok = false;
        console.error(chalk.yellow(`Missing talk_track file for ${scenario.id}: ${talkPath}`));
      }
    }
  }

  if (ok) console.log(chalk.green(`All ${entries.length} scenario(s) valid.`));
  return ok;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function renderPlaybooks(outDir?: string): Promise<void> {
  const outputDir = path.resolve(process.cwd(), outDir || GENERATED_DIR);
  await fs.ensureDir(outputDir);
  const tplSrc = await fs.readFile(TEMPLATE_PATH, 'utf8');
  const tpl = Handlebars.compile(tplSrc);
  const entries = await loadAllScenarios();

  for (const { scenario } of entries) {
    const md = tpl(scenario);
    const dest = path.join(outputDir, `${scenario.id}.md`);
    await fs.writeFile(dest, md, 'utf8');
    console.log(chalk.gray(`Rendered ${path.relative(process.cwd(), dest)}`));
  }
}

async function appendTelemetry(scenarioId: string, record: Record<string, unknown>) {
  await fs.ensureDir(TELEMETRY_DIR);
  const tPath = path.join(TELEMETRY_DIR, `${scenarioId}.jsonl`);
  await fs.appendFile(tPath, JSON.stringify(record) + '\n', 'utf8');
}

import { spawn } from 'child_process';

async function runTool(tool: string, args: string[] = []) {
  const cfg = await loadToolboxConfig();
  const entry = cfg.find(t => t.name === tool);
  if (!entry) throw new Error(`Tool not registered: ${tool}`);
  const parts = entry.command.split(' ');
  const cmd = parts[0];
  const cmdArgs = parts.slice(1).concat(args);
  await new Promise<void>((resolve, reject) => {
    const p = spawn(cmd, cmdArgs, { stdio: 'inherit' });
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${tool} exited ${code}`)));
    p.on('error', reject);
  });
}

async function captureTool(tool: string, args: string[] = []): Promise<string> {
  const cfg = await loadToolboxConfig();
  const entry = cfg.find(t => t.name === tool);
  if (!entry) throw new Error(`Tool not registered: ${tool}`);
  const parts = entry.command.split(' ');
  const cmd = parts[0];
  const cmdArgs = parts.slice(1).concat(args);
  return await new Promise<string>((resolve, reject) => {
    const p = spawn(cmd, cmdArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    p.stdout.on('data', d => out += d.toString());
    p.stderr.on('data', d => err += d.toString());
    p.on('exit', (code) => code === 0 ? resolve(out) : reject(new Error(err || `${tool} exited ${code}`)));
    p.on('error', reject);
  });
}

export async function runScenario(scenarioId: string): Promise<void> {
  const entries = await loadAllScenarios();
  const item = entries.find((e) => e.scenario.id === scenarioId);
  if (!item) {
    console.error(chalk.red(`Scenario not found: ${scenarioId}`));
    process.exitCode = 1;
    return;
  }
  const scenario = item.scenario;
  const now = () => new Date().toISOString();
  await appendTelemetry(scenario.id, { ts: now(), event: 'start' });
  for (const step of scenario.flow) {
    const start = Date.now();
    await appendTelemetry(scenario.id, { ts: now(), event: 'step_start', step: step.step });
    if (step.tool) {
      try {
        await runTool(step.tool, step.args);
      } catch (e: any) {
        console.error(chalk.red(`Tool step failed (${step.tool}): ${e.message}`));
        process.exitCode = 1;
      }
    } else {
      // Stub executor: simulate work
      await new Promise((r) => setTimeout(r, 10));
    }
    await appendTelemetry(scenario.id, {
      ts: now(),
      event: 'step_end',
      step: step.step,
      data: { duration_ms: Date.now() - start }
    });
  }
  await appendTelemetry(scenario.id, { ts: now(), event: 'end' });
  console.log(chalk.green(`Executed scenario: ${scenario.id}`));
}

async function generateScenarioFromSF(accountName: string, templateId: string | undefined, outDir: string) {
  // 1) fetch SF data
  const jsonStr = await captureTool('sf_fetch', ['--name', accountName]);
  const data = JSON.parse(jsonStr);
  const industry: string = data?.account?.Industry || '';
  // 2) pick template
  let chosen = templateId;
  if (!chosen) {
    const mappingPath = path.resolve(process.cwd(), 'config/scenario_mapping.yml');
    let mapping = { verticals: { default: { template: 'generic/node-unit-tests' } } } as any;
    if (await fs.pathExists(mappingPath)) {
      const raw = await fs.readFile(mappingPath, 'utf8');
      mapping = YAML.parse(raw);
    }
    const verts = mapping.verticals || {};
    chosen = (Object.keys(verts).find(v => (verts[v].industry_terms||[]).includes(industry)) && Object.keys(verts).find(v => (verts[v].industry_terms||[]).includes(industry)) !== 'default')
      ? verts[Object.keys(verts).find(v => (verts[v].industry_terms||[]).includes(industry))].template
      : (verts.default?.template || 'generic/node-unit-tests');
  }
  // 3) render template YAML & talk track
  const [vert, scen] = chosen.split('/');
  const tplPath = path.resolve(process.cwd(), 'projects/_templates', vert, `${scen}.template.yml`);
  const talkTplPath = path.resolve(process.cwd(), 'projects/_templates', vert, 'talktracks', `${scen}.md.hbs`);
  const yamlTpl = await fs.readFile(tplPath, 'utf8');
  const mdTpl = await fs.readFile(talkTplPath, 'utf8');
  const h = Handlebars.create();
  const scenarioId = `${slugify(scen)}-${slugify(data.account?.Name||'acct')}`;
  const projectSlug = slugify(`${data.account?.Name||'acct'}-demo`);
  const opps = data.opportunities || [];
  const biggestOpp = opps.reduce((a: any, b: any) => (a && a.Amount > b.Amount ? a : b), opps[0] || {});
  const ctx = {
    account: data.account || {},
    contacts: data.contacts || [],
    opportunities: opps,
    tasks: data.tasks || [],
    industry,
    opportunityCount: opps.length,
    biggestOpp,
    primaryContact: (data.contacts||[])[0] || {},
    secondaryContact: (data.contacts||[])[1] || null,
    scenarioId,
    projectSlug
  };
  const scenarioYaml = h.compile(yamlTpl)(ctx);
  const talkMd = h.compile(mdTpl)(ctx);
  const outProjectDir = path.resolve(process.cwd(), outDir, projectSlug);
  await fs.ensureDir(path.join(outProjectDir, 'talktracks'));
  await fs.writeFile(path.join(outProjectDir, 'scenario.yml'), scenarioYaml, 'utf8');
  await fs.writeFile(path.join(outProjectDir, 'talktracks', `${scenarioId}.md`), talkMd, 'utf8');
  console.log(chalk.green(`Generated scenario at ${path.relative(process.cwd(), outProjectDir)}`));
  // 4) validate & render
  const ok = await validateScenarios();
  if (ok) await renderPlaybooks();
}

async function main() {
  const program = new Command('scenario');
  program
    .command('validate')
    .description('Validate all scenario.yml files')
    .action(async () => {
      const ok = await validateScenarios();
      process.exit(ok ? 0 : 1);
    });

  program
    .command('render')
    .description('Render playbooks to docs/generated')
    .option('-o, --out <dir>', 'Output directory')
    .action(async (opts: { out?: string }) => {
      await renderPlaybooks(opts.out);
    });

  program
    .command('run')
    .description('Execute a scenario by id (runs registered tool steps)')
    .argument('<scenarioId>', 'Scenario id')
    .action(async (id: string) => {
      await runScenario(id);
    });

  program
    .command('enrich')
    .description('Run customer intelligence enrichment tool')
    .argument('<accountName>', 'Customer or account name')
    .option('-o, --out <file>', 'Output markdown path')
    .action(async (name: string, opts: { out?: string }) => {
      try {
        await runTool('intel_enrich', opts.out ? [name, opts.out] : [name]);
      } catch (e: any) {
        console.error(chalk.red(e.message));
        process.exit(1);
      }
    });

  program
    .command('generate-sf')
    .description('Generate a customised scenario from Salesforce data')
    .argument('<accountName>', 'Account name to look up in Salesforce')
    .option('-t, --template <id>', 'Template override, e.g. fintech/api-testing')
    .option('-o, --out-dir <dir>', 'Output directory under projects/', 'projects')
    .action(async (name: string, opts: { template?: string; outDir: string }) => {
      try {
        await generateScenarioFromSF(name, opts.template, opts.outDir);
      } catch (e: any) {
        console.error(chalk.red(e.message));
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}

if (import.meta.url === `file://${__filename}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
