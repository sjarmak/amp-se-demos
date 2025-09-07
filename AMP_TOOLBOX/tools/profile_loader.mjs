#!/usr/bin/env node
// Customer Profile Loader - replacement for sf_fetch.mjs
// Usage:
//   node AMP_TOOLBOX/tools/profile_loader.mjs --profile example_fintech [--out path]
//   node AMP_TOOLBOX/tools/profile_loader.mjs --file /path/to/profile.json [--out path]

import fs from 'fs/promises';
import path from 'path';

const args = process.argv.slice(2);
let profileName = '';
let profileFile = '';
let outFile = '';

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--profile') profileName = args[++i] || '';
  else if (a === '--file') profileFile = args[++i] || '';
  else if (a === '--out') outFile = args[++i] || '';
}

if (!profileName && !profileFile) {
  console.error('Provide --profile <name> or --file <path>');
  process.exit(2);
}

const PROFILES_DIR = path.resolve(process.cwd(), 'config/profiles');

async function loadProfile() {
  let filePath;
  
  if (profileFile) {
    filePath = path.resolve(profileFile);
  } else {
    filePath = path.join(PROFILES_DIR, `${profileName}.json`);
  }

  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Profile not found: ${filePath}`);
    }
    throw new Error(`Error reading profile: ${error.message}`);
  }
}

async function enrichProfileData(profile) {
  // Transform the customer profile into the format expected by the demo system
  const enriched = {
    ...profile,
    // Map to legacy salesforce-like structure for compatibility
    account: {
      Id: `profile_${Date.now()}`,
      Name: profile.company.name,
      Industry: profile.company.industry,
      Website: profile.company.website,
      BillingCountry: profile.company.country,
      AccountTier__c: profile.company.size,
      LastModifiedDate: profile.created_at || new Date().toISOString()
    },
    contacts: profile.contacts.map((contact, index) => ({
      Id: `contact_${index}`,
      AccountId: `profile_${Date.now()}`,
      Name: contact.name,
      FirstName: contact.name.split(' ')[0],
      LastName: contact.name.split(' ').slice(1).join(' '),
      Title: contact.role,
      Email: contact.email,
      Department: contact.department,
      LastActivityDate: new Date().toISOString()
    })),
    opportunities: profile.recent_projects?.map((project, index) => ({
      Id: `opp_${index}`,
      Name: project.name,
      StageName: project.stage,
      Amount: null,
      CloseDate: null,
      ForecastCategory: 'Pipeline',
      LastModifiedDate: new Date().toISOString(),
      Description: project.description
    })) || [],
    tasks: [],
    fetchedAt: new Date().toISOString(),
    source: 'json_profile',
    // Demo-specific enrichment
    demo_config: {
      use_cases: profile.demo_context.use_cases,
      audience_level: profile.demo_context.audience_level,
      duration: profile.demo_context.demo_duration,
      pain_points: profile.demo_context.pain_points,
      success_metrics: profile.demo_context.success_metrics,
      tech_stack: profile.company.tech_stack,
      security_focus: profile.preferences?.include_security_scenarios || false,
      show_enterprise_features: profile.preferences?.show_enterprise_features || false
    }
  };

  return enriched;
}

async function listAvailableProfiles() {
  try {
    const files = await fs.readdir(PROFILES_DIR);
    const profiles = files
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));
    
    return profiles;
  } catch (error) {
    return [];
  }
}

try {
  const profile = await loadProfile();
  const enrichedData = await enrichProfileData(profile);
  const json = JSON.stringify(enrichedData, null, 2);
  
  if (outFile) {
    await fs.mkdir(path.dirname(outFile), { recursive: true }).catch(() => {});
    await fs.writeFile(outFile, json, 'utf8');
    console.log(outFile);
  } else {
    console.log(json);
  }
} catch (e) {
  console.error('profile_loader failed:', e.message);
  
  if (e.message.includes('Profile not found')) {
    console.error('Available profiles:', (await listAvailableProfiles()).join(', '));
  }
  
  process.exit(1);
}
