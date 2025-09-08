#!/usr/bin/env node
// Demo Customizer - intelligently selects and customizes demos based on customer profile
// Usage:
//   node AMP_TOOLBOX/tools/demo_customizer.mjs --profile example_fintech [--duration 20] [--out path]
//   node AMP_TOOLBOX/tools/demo_customizer.mjs --file /path/to/profile.json [--use-cases context_restoration,debugging_investigation]

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
let profileName = '';
let profileFile = '';
let requestedDuration = null;
let requestedUseCases = [];
let outFile = '';

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--profile') profileName = args[++i] || '';
  else if (a === '--file') profileFile = args[++i] || '';
  else if (a === '--duration') requestedDuration = parseInt(args[++i]) || null;
  else if (a === '--use-cases') requestedUseCases = (args[++i] || '').split(',');
  else if (a === '--out') outFile = args[++i] || '';
}

if (!profileName && !profileFile) {
  console.error('Provide --profile <name> or --file <path>');
  process.exit(2);
}

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function loadProfile() {
  const PROFILES_DIR = path.resolve(process.cwd(), 'config/profiles');
  let filePath;
  
  if (profileFile) {
    filePath = path.resolve(profileFile);
  } else {
    filePath = path.join(PROFILES_DIR, `${profileName}.json`);
  }

  try {
    return await loadJSON(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Profile not found: ${filePath}`);
    }
    throw new Error(`Error reading profile: ${error.message}`);
  }
}

async function loadProjectsAndMapping() {
  const projectsPath = path.resolve(process.cwd(), 'PROJECTS.json');
  const mappingPath = path.resolve(process.cwd(), 'config/use_case_mapping.json');
  
  const [projects, mapping] = await Promise.all([
    loadJSON(projectsPath),
    loadJSON(mappingPath)
  ]);
  
  return { projects, mapping };
}

function selectBestProjects(profile, mapping, projects) {
  const useCases = requestedUseCases.length > 0 ? requestedUseCases : profile.demo_context.use_cases;
  const techStack = profile.company.tech_stack || [];
  const audienceLevel = profile.demo_context.audience_level;
  const targetDuration = requestedDuration || profile.demo_context.demo_duration;
  
  // Score projects based on use case alignment, tech stack match, and capabilities
  const projectScores = projects.map(project => {
    let score = 0;
    
    // Use case alignment
    const projectUseCases = project.use_case_mapping || [];
    const useCaseMatches = useCases.filter(uc => projectUseCases.includes(uc)).length;
    score += useCaseMatches * 10;
    
    // Tech stack alignment
    const techMatches = techStack.filter(tech => project.stack.includes(tech)).length;
    score += techMatches * 5;
    
    // Audience level appropriateness
    const audiencePreferences = mapping.audience_mapping[audienceLevel];
    if (audienceLevel === 'executive' && project.capabilities.includes('end-to-end')) score += 8;
    
    if (audienceLevel === 'junior_engineer' && project.capabilities.includes('diagramming')) score += 6;
    
    // Demo flow duration alignment
    const bestFlow = project.demo_flows?.find(flow => 
      Math.abs(flow.duration_min - targetDuration) <= 5
    );
    if (bestFlow) score += 7;
    
    return {
      project,
      score,
      reasons: {
        use_case_matches: useCaseMatches,
        tech_matches: techMatches,
        best_flow: bestFlow?.name
      }
    };
  });
  
  // Sort by score and return top projects
  return projectScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function generateTalkTrack(profile, selectedProjects, mapping) {
  const company = profile.company.name;
  const industry = profile.company.industry;
  const painPoints = profile.demo_context.pain_points || [];
  const successMetrics = profile.demo_context.success_metrics || [];
  
  let talkTrack = `Demo customized for ${company} (${industry}):\n\n`;
  
  if (painPoints.length > 0) {
    talkTrack += `Key challenges we'll address:\n`;
    painPoints.forEach((pain, i) => {
      talkTrack += `${i + 1}. ${pain}\n`;
    });
    talkTrack += '\n';
  }
  
  talkTrack += `Recommended demo flows:\n`;
  selectedProjects.forEach((scored, i) => {
    const project = scored.project;
    talkTrack += `\n${i + 1}. ${project.id}: ${scored.reasons.best_flow || project.demo_flows[0]?.name}\n`;
    talkTrack += `   Tech stack: ${project.stack.join(', ')}\n`;
    talkTrack += `   Why: ${scored.reasons.use_case_matches} use case matches, ${scored.reasons.tech_matches} tech matches\n`;
  });
  
  if (successMetrics.length > 0) {
    talkTrack += `\nSuccess metrics to highlight:\n`;
    successMetrics.forEach((metric, i) => {
      talkTrack += `• ${metric}\n`;
    });
  }
  
  return talkTrack;
}

function generateCustomizedDemo(profile, selectedProjects, mapping) {
  const useCases = requestedUseCases.length > 0 ? requestedUseCases : profile.demo_context.use_cases;
  
  return {
    customer_profile: {
      name: profile.company.name,
      industry: profile.company.industry,
      size: profile.company.size,
      tech_stack: profile.company.tech_stack,
      audience_level: profile.demo_context.audience_level,
      target_duration: requestedDuration || profile.demo_context.demo_duration
    },
    selected_use_cases: useCases.map(uc => ({
      id: uc,
      name: mapping.use_cases[uc]?.name,
      description: mapping.use_cases[uc]?.description
    })),
    recommended_projects: selectedProjects.map(scored => ({
      id: scored.project.id,
      name: scored.project.id.replace(/^\d+-/, '').replace(/-/g, ' '),
      stack: scored.project.stack,
      score: scored.score,
      reasoning: scored.reasons,
      demo_flows: scored.project.demo_flows,
      capabilities: scored.project.capabilities,
      datasets: scored.project.datasets || []
    })),
    talk_track: generateTalkTrack(profile, selectedProjects, mapping),
    demo_config: {
      show_diagnostics: profile.preferences?.show_diagnostics !== false,
      include_security_scenarios: profile.preferences?.include_security_scenarios || false,
      emphasize_collaboration: profile.preferences?.emphasize_collaboration !== false,
      show_enterprise_features: profile.preferences?.show_enterprise_features || false
    },
    generated_at: new Date().toISOString(),
    source: 'demo_customizer'
  };
}

try {
  const profile = await loadProfile();
  const { projects, mapping } = await loadProjectsAndMapping();
  
  const selectedProjects = selectBestProjects(profile, mapping, projects);
  const customizedDemo = generateCustomizedDemo(profile, selectedProjects, mapping);
  
  const json = JSON.stringify(customizedDemo, null, 2);
  
  if (outFile) {
    await fs.mkdir(path.dirname(outFile), { recursive: true }).catch(() => {});
    await fs.writeFile(outFile, json, 'utf8');
    console.log(`Customized demo written to: ${outFile}`);
  } else {
    console.log(json);
  }
  
} catch (e) {
  console.error('demo_customizer failed:', e.message);
  process.exit(1);
}
