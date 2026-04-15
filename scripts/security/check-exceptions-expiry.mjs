#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const MS_PER_DAY = 24 * 60 * 60 * 1000;

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
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
}

function parseJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`No se pudo leer ${filePath}: ${error.message}`);
  }
}

function daysUntil(dateIso) {
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const target = new Date(dateIso);
  const targetDate = new Date(
    Date.UTC(
      target.getUTCFullYear(),
      target.getUTCMonth(),
      target.getUTCDate(),
    ),
  );
  return Math.floor((targetDate - today) / MS_PER_DAY);
}

function getAuditEntries(policy) {
  const exceptions = Array.isArray(policy?.exceptions) ? policy.exceptions : [];
  const graceWindow = Array.isArray(policy?.graceWindow)
    ? policy.graceWindow
    : [];
  const defaultGraceDays = Number(policy?.defaultGraceDays ?? 14);

  const entries = exceptions
    .filter((e) => e?.id && e?.expiresOn)
    .map((e) => ({
      source: "audit.exceptions",
      id: e.id,
      expiresOn: e.expiresOn,
      reason: e.reason ?? "",
    }));

  for (const item of graceWindow) {
    if (!item?.id || !item?.detectedOn) continue;
    const graceDays = Number(item?.graceDays ?? defaultGraceDays);
    if (Number.isNaN(graceDays) || graceDays < 0) continue;
    const detected = new Date(item.detectedOn);
    if (Number.isNaN(detected.getTime())) continue;
    const expires = new Date(detected.getTime() + graceDays * MS_PER_DAY)
      .toISOString()
      .slice(0, 10);
    entries.push({
      source: "audit.graceWindow",
      id: item.id,
      expiresOn: expires,
      reason: item.reason ?? "",
    });
  }

  return entries;
}

function getOsvEntries(policy) {
  const exceptions = Array.isArray(policy?.exceptions) ? policy.exceptions : [];
  return exceptions
    .filter((e) => e?.id && e?.expiresOn)
    .map((e) => ({
      source: "osv.exceptions",
      id: e.id,
      expiresOn: e.expiresOn,
      reason: e.reason ?? "",
    }));
}

const args = parseArgs(process.argv.slice(2));
const warnDays = Number(
  args["warn-days"] ?? process.env.EXCEPTION_WARN_DAYS ?? 14,
);
const enforce = toBool(
  args.enforce ?? process.env.ENFORCE_EXCEPTION_EXPIRY,
  false,
);

const auditPolicyPath = path.join(root, "security", "audit-grace-policy.json");
const osvPolicyPath = path.join(root, "security", "osv-exceptions.json");

const errors = [];
const soon = [];
let expiredCount = 0;

try {
  const auditPolicy = parseJson(auditPolicyPath);
  const osvPolicy = parseJson(osvPolicyPath);
  const entries = [
    ...getAuditEntries(auditPolicy),
    ...getOsvEntries(osvPolicy),
  ];

  for (const entry of entries) {
    const remaining = daysUntil(entry.expiresOn);
    if (Number.isNaN(remaining)) {
      errors.push(
        `Fecha inválida en ${entry.source} (${entry.id}): ${entry.expiresOn}`,
      );
      continue;
    }

    if (remaining < 0) {
      expiredCount += 1;
      console.error(
        `❌ Expirada: ${entry.source} id=${entry.id} expiró el ${entry.expiresOn}`,
      );
      continue;
    }

    if (remaining <= warnDays) {
      soon.push(entry);
      console.warn(
        `⚠️  Próxima a expirar (${remaining}d): ${entry.source} id=${entry.id} (${entry.expiresOn})`,
      );
    }
  }
} catch (error) {
  errors.push(error.message);
}

if (errors.length > 0) {
  for (const error of errors) console.error(`❌ ${error}`);
  process.exit(1);
}

console.log(
  `Revisión de expiración completada. Expiradas=${expiredCount}, próximas=${soon.length}.`,
);

if (enforce && expiredCount > 0) {
  console.error("❌ Enforcement activo: hay excepciones expiradas.");
  process.exit(1);
}

console.log("✅ Política de expiración OK.");
