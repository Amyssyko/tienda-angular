#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const severityRank = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const part = argv[i];
    if (!part.startsWith("--")) continue;
    const key = part.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      out[key] = "true";
    } else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

function toBool(value, fallback = false) {
  if (value === undefined || value === null) return fallback;
  return String(value).toLowerCase() === "true";
}

function normalizeSeverity(value) {
  const raw = String(value ?? "")
    .trim()
    .toUpperCase();
  if (raw === "MODERATE") return "MEDIUM";
  if (raw === "LOW" || raw === "MEDIUM" || raw === "HIGH" || raw === "CRITICAL")
    return raw;
  return "LOW";
}

function scoreToSeverity(score) {
  if (score >= 9.0) return "CRITICAL";
  if (score >= 7.0) return "HIGH";
  if (score >= 4.0) return "MEDIUM";
  return "LOW";
}

function parseDate(dateIso) {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function isExceptionActive(item) {
  const expires = parseDate(item?.expiresOn);
  if (!expires) return false;

  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  return expires >= today;
}

function extractSeverity(vuln) {
  const direct = normalizeSeverity(
    vuln?.database_specific?.severity ?? vuln?.severity,
  );
  let best = direct;

  if (Array.isArray(vuln?.severity)) {
    for (const entry of vuln.severity) {
      const directLabel = normalizeSeverity(entry?.score ?? entry?.severity);
      if (severityRank[directLabel] > severityRank[best]) {
        best = directLabel;
      }

      const scoreText = String(entry?.score ?? "").replace(",", ".");
      const num = Number(scoreText.match(/\d+(\.\d+)?/)?.[0]);
      if (!Number.isNaN(num)) {
        const mapped = scoreToSeverity(num);
        if (severityRank[mapped] > severityRank[best]) {
          best = mapped;
        }
      }
    }
  }

  return best;
}

function collectFindings(data) {
  const findings = [];
  const results = Array.isArray(data?.results) ? data.results : [];

  for (const result of results) {
    const packages = Array.isArray(result?.packages) ? result.packages : [];

    for (const pkg of packages) {
      const packageName =
        pkg?.package?.name ?? pkg?.package?.purl ?? "unknown-package";
      const vulnerabilities = Array.isArray(pkg?.vulnerabilities)
        ? pkg.vulnerabilities
        : [];

      for (const vuln of vulnerabilities) {
        const id = String(
          vuln?.id ??
            vuln?.aliases?.[0] ??
            `OSV-UNKNOWN-${findings.length + 1}`,
        ).toUpperCase();
        findings.push({
          id,
          aliases: Array.isArray(vuln?.aliases)
            ? vuln.aliases.map((a) => String(a).toUpperCase())
            : [],
          package: packageName,
          severity: extractSeverity(vuln),
        });
      }
    }
  }

  return findings;
}

const args = parseArgs(process.argv.slice(2));
const enforce = toBool(args.enforce ?? process.env.OSV_ENFORCE, false);
const threshold = normalizeSeverity(
  args.threshold ?? process.env.OSV_FAIL_ON_SEVERITY ?? "HIGH",
);
const resultsPath = path.resolve(
  root,
  args["results-file"] ?? "osv-results.json",
);
const exceptionsPath = path.resolve(
  root,
  args["exceptions-file"] ?? "security/osv-exceptions.json",
);

if (!fs.existsSync(resultsPath)) {
  console.error(`❌ No existe archivo de resultados OSV: ${resultsPath}`);
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
const exceptionsDoc = fs.existsSync(exceptionsPath)
  ? JSON.parse(fs.readFileSync(exceptionsPath, "utf8"))
  : { exceptions: [] };
const exceptions = Array.isArray(exceptionsDoc.exceptions)
  ? exceptionsDoc.exceptions
  : [];

const findings = collectFindings(results);
const thresholdRank = severityRank[threshold] ?? severityRank.HIGH;
const gated = findings.filter(
  (f) => (severityRank[f.severity] ?? 0) >= thresholdRank,
);

function isFindingExcepted(finding) {
  return exceptions.some((rule) => {
    if (!isExceptionActive(rule)) return false;

    const ruleId = String(rule?.id ?? "").toUpperCase();
    const idMatch = ruleId === finding.id || finding.aliases.includes(ruleId);
    if (!idMatch) return false;

    if (!rule?.package) return true;
    return (
      String(rule.package).toLowerCase() ===
      String(finding.package).toLowerCase()
    );
  });
}

const blocked = gated.filter((finding) => !isFindingExcepted(finding));

console.log(`OSV findings totales: ${findings.length}`);
console.log(`Gating >= ${threshold}: ${gated.length}`);
console.log(`Bloqueantes: ${blocked.length}`);

for (const finding of blocked) {
  console.error(`❌ ${finding.severity} ${finding.id} (${finding.package})`);
}

if (enforce && blocked.length > 0) {
  console.error("❌ Enforcement activo: hallazgos OSV bloqueantes.");
  process.exit(1);
}

if (!enforce && blocked.length > 0) {
  console.warn(
    "⚠️  Modo reporte: hallazgos OSV bloqueantes detectados sin fallar el job.",
  );
}

console.log("✅ Política OSV aplicada.");
