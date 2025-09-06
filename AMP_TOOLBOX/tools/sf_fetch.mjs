#!/usr/bin/env node
// Structured Salesforce fetcher
// Usage:
//   node AMP_TOOLBOX/tools/sf_fetch.mjs --name "Account Name" [--out path]
//   node AMP_TOOLBOX/tools/sf_fetch.mjs --id 001XXXXXXXXXXXXXXX [--out path]

import fs from 'fs/promises';

const args = process.argv.slice(2);
let accountName = '';
let accountId = '';
let outFile = '';
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--name') accountName = args[++i] || '';
  else if (a === '--id') accountId = args[++i] || '';
  else if (a === '--out') outFile = args[++i] || '';
}
if (!accountName && !accountId) {
  console.error('Provide --name or --id');
  process.exit(2);
}

const SF_INSTANCE_URL = process.env.SF_INSTANCE_URL || process.env.SF_INSTANCE || '';
const SF_ACCESS_TOKEN = process.env.SF_ACCESS_TOKEN || process.env.SF_TOKEN || '';
const SF_API_VERSION = process.env.SF_API_VERSION || '60.0';

if (!SF_INSTANCE_URL || !SF_ACCESS_TOKEN) {
  console.error('Missing SF_INSTANCE_URL or SF_ACCESS_TOKEN');
  process.exit(2);
}

const base = `${SF_INSTANCE_URL}/services/data/v${SF_API_VERSION}`;

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SF_ACCESS_TOKEN}`, 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.json();
}

function soql(q) {
  return `${base}/query/?q=${encodeURIComponent(q)}`;
}

async function findAccount() {
  if (accountId) {
    const q = `SELECT Id, Name, Website, Industry, BillingCountry, OwnerId, AccountTier__c, LastModifiedDate FROM Account WHERE Id='${accountId}' LIMIT 1`;
    const r = await fetchJSON(soql(q));
    return r.records?.[0] || null;
  }
  const q = `SELECT Id, Name, Website, Industry, BillingCountry, OwnerId, AccountTier__c, LastModifiedDate FROM Account WHERE Name LIKE '%${accountName.replace(/'/g, "''")}%' ORDER BY LastModifiedDate DESC LIMIT 5`;
  const r = await fetchJSON(soql(q));
  return r.records?.[0] || null;
}

async function fetchBundle(id) {
  const acc = await findAccount();
  const accId = acc?.Id || id;
  if (!accId) throw new Error('Account not found');
  const contactsQ = `SELECT Id, AccountId, Name, FirstName, LastName, Title, Email, Phone, Department, LastActivityDate FROM Contact WHERE AccountId='${accId}' ORDER BY LastActivityDate DESC LIMIT 50`;
  const oppsQ = `SELECT Id, Name, StageName, Amount, CloseDate, ForecastCategory, LastModifiedDate FROM Opportunity WHERE AccountId='${accId}' AND (IsClosed = FALSE OR CloseDate = LAST_N_MONTHS:12) ORDER BY CloseDate DESC LIMIT 50`;
  const tasksQ = `SELECT Id, Subject, ActivityDate, Status, Owner.Name, WhatId, WhoId FROM Task WHERE WhatId='${accId}' ORDER BY ActivityDate DESC LIMIT 50`;
  const [contacts, opportunities, tasks] = await Promise.all([
    fetchJSON(soql(contactsQ)).then(x => x.records || []).catch(() => []),
    fetchJSON(soql(oppsQ)).then(x => x.records || []).catch(() => []),
    fetchJSON(soql(tasksQ)).then(x => x.records || []).catch(() => [])
  ]);
  return { account: acc, contacts, opportunities, tasks, fetchedAt: new Date().toISOString(), source: 'salesforce' };
}

try {
  const data = await fetchBundle(accountId);
  const json = JSON.stringify(data, null, 2);
  if (outFile) {
    await fs.mkdir(new URL('file://' + outFile).pathname.split('/').slice(0,-1).join('/'), { recursive: true }).catch(()=>{});
    await fs.writeFile(outFile, json, 'utf8');
    console.log(outFile);
  } else {
    console.log(json);
  }
} catch (e) {
  console.error('sf_fetch failed:', e.message);
  process.exit(1);
}
