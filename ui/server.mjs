#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'content-type': type });
  res.end(body);
}

function escapeCell(value = '') {
  return String(value).replaceAll('|', '/').replaceAll('\n', ' ').trim();
}

function splitMarkdownRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

async function parseApplications() {
  const file = path.join(root, 'data', 'applications.md');
  if (!existsSync(file)) return [];
  const content = await readFile(file, 'utf8');
  return content
    .split('\n')
    .filter((line) => line.startsWith('|') && !line.includes('---') && !line.includes('| # |'))
    .map(splitMarkdownRow)
    .filter((cells) => cells.length >= 8 && !Number.isNaN(Number(cells[0])))
    .map((cells) => ({
      number: cells[0],
      date: cells[1],
      company: cells[2],
      role: cells[3],
      score: cells[4],
      status: cells[5],
      pdf: cells[6],
      report: cells[7],
      notes: cells[8] || '',
    }));
}

async function parsePipeline() {
  const file = path.join(root, 'data', 'pipeline.md');
  if (!existsSync(file)) return [];
  const content = await readFile(file, 'utf8');
  return content
    .split('\n')
    .filter((line) => line.startsWith('|') && !line.includes('---') && !line.includes('Date Added'))
    .map(splitMarkdownRow)
    .filter((cells) => cells.length >= 5)
    .map((cells) => ({
      dateAdded: cells[0],
      source: cells[1],
      company: cells[2],
      role: cells[3],
      notes: cells[4],
    }));
}

async function addPipelineEntry(payload) {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const source = String(payload.source || '').trim();
  if (!source) {
    throw new Error('Paste a job URL or job description first.');
  }

  let pipelineSource = source;
  if (!/^https?:\/\//i.test(source)) {
    await mkdir(path.join(root, 'jds'), { recursive: true });
    const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const jdFile = path.join(root, 'jds', `inbox-${stamp}.md`);
    await writeFile(jdFile, source.endsWith('\n') ? source : `${source}\n`);
    pipelineSource = `jds/${path.basename(jdFile)}`;
  }

  const file = path.join(root, 'data', 'pipeline.md');
  const row = `| ${date} | ${escapeCell(pipelineSource)} | ${escapeCell(payload.company || 'TBD')} | ${escapeCell(payload.role || 'TBD')} | ${escapeCell(payload.notes || 'Added from Lumen UI')} |\n`;
  const existing = existsSync(file)
    ? await readFile(file, 'utf8')
    : '# Pending Role Pipeline\n\n| Date Added | Source | Company | Role | Notes |\n|---|---|---|---|---|\n';
  await writeFile(file, existing.endsWith('\n') ? existing + row : `${existing}\n${row}`);
  return { pipelineSource };
}

async function getState() {
  const [applications, pipeline] = await Promise.all([parseApplications(), parsePipeline()]);
  const profileExists = existsSync(path.join(root, 'config', 'profile.yml'));
  const openBrainProtocolExists = existsSync(path.join(root, 'docs', 'OPENBRAIN_PROTOCOL.md'));
  return {
    applications,
    pipeline,
    metrics: {
      tracked: applications.length,
      pending: pipeline.length,
      highFit: applications.filter((app) => Number.parseFloat(app.score) >= 4).length,
    },
    openBrain: {
      protocolExists: openBrainProtocolExists,
      profileConfigured: profileExists,
      connection: 'Available through Codex MCP; this UI surfaces the protocol and local working files.',
      recallRule: 'Recall before role evaluation, resume tailoring, cover letters, proof-point selection, and interview story selection.',
    },
  };
}

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, `http://${host}:${port}`).pathname);
  const relativePath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
  const base = relativePath.startsWith('fonts/') ? root : __dirname;
  const filePath = path.resolve(base, relativePath);
  if (!filePath.startsWith(base)) {
    send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
    return;
  }
  try {
    await stat(filePath);
    const body = await readFile(filePath);
    send(res, 200, body, contentTypes[path.extname(filePath)] || 'application/octet-stream');
  } catch {
    send(res, 404, 'Not found', 'text/plain; charset=utf-8');
  }
}

const server = createServer(async (req, res) => {
  try {
    if (req.url === '/api/state' && req.method === 'GET') {
      send(res, 200, JSON.stringify(await getState()));
      return;
    }
    if (req.url === '/api/pipeline' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const result = await addPipelineEntry(JSON.parse(body || '{}'));
      send(res, 201, JSON.stringify(result));
      return;
    }
    await serveStatic(req, res);
  } catch (error) {
    send(res, 500, JSON.stringify({ error: error.message || 'Something went wrong.' }));
  }
});

server.listen(port, host, () => {
  console.log(`Career-Ops Lumen UI: http://${host}:${port}`);
});
