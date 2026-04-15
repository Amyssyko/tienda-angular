#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const MS_PER_DAY = 24 * 60 * 60 * 1000;
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

function isGraceActive(item, defaultGraceDays) {
  if (!item?.detectedOn) return false;
  const detected = parseDate(item.detectedOn);
  if (!detected) return false;
  const days = Number(item?.graceDays ?? defaultGraceDays);
  if (Number.isNaN(days) || days < 0) return false;
  const expires = new Date(detected.getTime() + days * MS_PER_DAY);

  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  return expires >= today;
}

function readJsonMaybe(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parsePackageManagerAuditText(content) {
  const findings = [];
  const blocks = content
    .split(
      /\n(?=┌─────────────────────┬────────────────────────────────────────────────────────┐)/g,
    )
    .filter((part) => part.includes("│ Package"));

  for (const block of blocks) {
    const severityMatch = block.match(
      /│\s*(low|moderate|medium|high|critical)\s*│/i,
    );
    if (!severityMatch) continue;

    const severity = normalizeSeverity(severityMatch[1]);
    const packageMatch = block.match(/│\s*Package\s*│\s*([^\n│]+)\s*│/i);
    const idMatch = block.match(
      /\b(GHSA-[a-z0-9-]+|CVE-\d{4}-\d+|npm:[a-z0-9._/-]+)\b/i,
    );

    findings.push({
      source: "bun",
      id: (idMatch?.[1] ?? `AUDIT-BLOCK-${findings.length + 1}`).toUpperCase(),
      package: packageMatch?.[1]?.trim(),
      severity,
      raw: block,
    });
  }

  if (findings.length === 0) {
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const severityMatch = line.match(
        /\b(low|moderate|medium|high|critical)\b/i,
      );
      if (!severityMatch) continue;

      const severity = normalizeSeverity(severityMatch[1]);
      const idMatch = line.match(
        /\b(GHSA-[a-z0-9-]+|CVE-\d{4}-\d+|npm:[a-z0-9._/-]+)\b/i,
      );
      if (!idMatch) continue;
      const pkgMatch = line.match(
        /\b(?:package|module|in)\s*[:=]?\s*([@a-z0-9._/-]+)\b/i,
      );

      findings.push({
        source: "bun",
        id: (idMatch?.[1] ?? `AUDIT-LINE-${findings.length + 1}`).toUpperCase(),
        package: pkgMatch?.[1],
        severity,
        raw: line,
      });
    }
  }

  return findings;
}

function parseNpmAuditJson(data) {
  const findings = [];

  if (data?.vulnerabilities && typeof data.vulnerabilities === "object") {
    for (const [pkgName, vuln] of Object.entries(data.vulnerabilities)) {
      const via = Array.isArray(vuln?.via) ? vuln.via : [];
      for (const item of via) {
        if (typeof item === "string") {
          findings.push({
            source: "npm",
            id: `NPM-${item}`.toUpperCase(),
            package: pkgName,
            severity: normalizeSeverity(vuln?.severity),
          });
          continue;
        }

        findings.push({
          source: "npm",
          id: String(
            item?.source ?? item?.url ?? item?.name ?? `NPM-${pkgName}`,
          ).toUpperCase(),
          package: item?.name ?? pkgName,
          severity: normalizeSeverity(item?.severity ?? vuln?.severity),
        });
      }

      if (via.length === 0 && vuln?.severity) {
        findings.push({
          source: "npm",
          id: `NPM-${pkgName}`.toUpperCase(),
          package: pkgName,
          severity: normalizeSeverity(vuln.severity),
        });
      }
    }
  }

  if (data?.advisories && typeof data.advisories === "object") {
    for (const adv of Object.values(data.advisories)) {
      findings.push({
        source: "npm",
        id: String(
          adv?.id ??
            adv?.github_advisory_id ??
            adv?.module_name ??
            "NPM-ADVISORY",
        ).toUpperCase(),
        package: adv?.module_name,
        severity: normalizeSeverity(adv?.severity),
      });
    }
  }

  return findings;
}

function keyOf(finding) {
  return `${finding.id}|${finding.package ?? ""}|${finding.severity}`;
}

const args = parseArgs(process.argv.slice(2));
const policyPath = path.resolve(
  root,
  args["policy-file"] ?? "security/audit-grace-policy.json",
);
const auditReportPath = path.resolve(
  root,
  args["audit-file"] ?? "bun-audit.txt",
);
const npmAuditPath = path.resolve(
  root,
  args["npm-audit-file"] ?? "npm-audit.json",
);

const enforce = toBool(args.enforce ?? process.env.AUDIT_ENFORCE, false);
const policy = readJsonMaybe(policyPath) ?? {};
const threshold = normalizeSeverity(
  args.threshold ??
    process.env.AUDIT_FAIL_ON_SEVERITY ??
    policy.defaultThreshold ??
    "HIGH",
);
const defaultGraceDays = Number(
  args["default-grace-days"] ??
    process.env.AUDIT_GRACE_DAYS ??
    policy.defaultGraceDays ??
    14,
);
const exceptions = Array.isArray(policy.exceptions) ? policy.exceptions : [];
const graceWindow = Array.isArray(policy.graceWindow) ? policy.graceWindow : [];

if (!fs.existsSync(auditReportPath)) {
  console.error(
    `❌ No existe reporte de auditoría del package manager: ${auditReportPath}`,
  );
  process.exit(1);
}

const auditText = fs.readFileSync(auditReportPath, "utf8");
const findings = parsePackageManagerAuditText(auditText);

if (fs.existsSync(npmAuditPath)) {
  try {
    const npmJson = JSON.parse(fs.readFileSync(npmAuditPath, "utf8"));
    findings.push(...parseNpmAuditJson(npmJson));
  } catch (error) {
    console.warn(
      `⚠️  No se pudo parsear ${path.basename(npmAuditPath)}: ${error.message}`,
    );
  }
}

const dedup = new Map();
for (const finding of findings) {
  dedup.set(keyOf(finding), finding);
}
const uniqueFindings = [...dedup.values()];

const thresholdRank = severityRank[threshold] ?? severityRank.HIGH;
const gated = uniqueFindings.filter(
  (f) => (severityRank[f.severity] ?? 0) >= thresholdRank,
);

function matchByIdAndPackage(rule, finding) {
  if (!rule?.id) return false;
  if (String(rule.id).toUpperCase() !== finding.id.toUpperCase()) return false;
  if (!rule.package) return true;
  return (
    String(rule.package).toLowerCase() ===
    String(finding.package ?? "").toLowerCase()
  );
}

const blocked = [];
const allowed = [];

for (const finding of gated) {
  const hasActiveException = exceptions.some(
    (ex) => matchByIdAndPackage(ex, finding) && isExceptionActive(ex),
  );
  const hasActiveGrace = graceWindow.some(
    (gr) =>
      matchByIdAndPackage(gr, finding) && isGraceActive(gr, defaultGraceDays),
  );

  if (hasActiveException || hasActiveGrace) {
    allowed.push(finding);
  } else {
    blocked.push(finding);
  }
}

console.log(`Audit findings totales: ${uniqueFindings.length}`);
console.log(`Gating >= ${threshold}: ${gated.length}`);
console.log(`Permitidas por excepción/gracia: ${allowed.length}`);
console.log(`Bloqueantes: ${blocked.length}`);

for (const finding of blocked) {
  console.error(
    `❌ ${finding.severity} ${finding.id}${finding.package ? ` (${finding.package})` : ""} [${finding.source}]`,
  );
}

if (enforce && blocked.length > 0) {
  console.error(
    "❌ Enforcement activo: existen vulnerabilidades bloqueantes de auditoría.",
  );
  process.exit(1);
}

if (!enforce && blocked.length > 0) {
  console.warn(
    "⚠️  Modo reporte: se detectaron vulnerabilidades bloqueantes, pero no se falla el job.",
  );
}

console.log("✅ Política de auditoría aplicada.");
