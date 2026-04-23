import fs from 'fs';
import path from 'path';
import { phaseOneStyleAuditExclusions } from '../src/design/tokens.ts';

const exts = new Set(['.astro', '.ts', '.tsx', '.js', '.jsx', '.css']);
const tokenLayerFiles = new Set(['src/design/tokens.ts', 'src/styles/tokens.css']);

const checks = [
  {
    name: 'hex',
    test: (text) => [...text.matchAll(/#(?:[0-9a-fA-F]{3,8})\b/g)].map((match) => match[0]),
  },
  {
    name: 'rgb-hardcoded',
    test: (text) =>
      [...text.matchAll(/rgba?\([^\n]+?\)/g)]
        .map((match) => match[0])
        .filter((value) => !value.includes('var(')),
  },
  {
    name: 'font-family-hardcoded',
    test: (text) =>
      [...text.matchAll(/font-family\s*:[^;]+;/g)]
        .map((match) => match[0])
        .filter((value) => !value.includes('var(')),
  },
  {
    name: 'font-name-hardcoded',
    test: (text) =>
      [...text.matchAll(/['"](Inter|Fraunces|General Sans|JetBrains Mono|Space Grotesk|Archivo|Cormorant Garamond)['"]/g)].map(
        (match) => match[0]
      ),
  },
];

const root = 'src';
const results = [];

const isExcluded = (file) => phaseOneStyleAuditExclusions.some((prefix) => file.startsWith(prefix));

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const joined = path.join(dir, entry.name);
    const normalized = joined.replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (!isExcluded(`${normalized}/`)) walk(joined);
      continue;
    }

    if (!exts.has(path.extname(entry.name))) continue;
    if (tokenLayerFiles.has(normalized) || isExcluded(normalized)) continue;

    const text = fs.readFileSync(joined, 'utf8');
    const findings = checks
      .map((check) => ({ name: check.name, matches: check.test(text) }))
      .filter((entry) => entry.matches.length > 0);

    if (findings.length) {
      results.push({
        file: normalized,
        findings: findings.map((finding) => ({
          type: finding.name,
          count: finding.matches.length,
          samples: finding.matches.slice(0, 3),
        })),
      });
    }
  }
}

walk(root);

const payload = {
  auditedAt: new Date().toISOString(),
  scope: 'Phase 1 foundation scope',
  tokenLayerFiles: [...tokenLayerFiles],
  excludedPaths: phaseOneStyleAuditExclusions,
  results,
};

if (process.argv[2]) {
  fs.writeFileSync(process.argv[2], JSON.stringify(payload, null, 2));
} else {
  console.log(JSON.stringify(payload, null, 2));
}
