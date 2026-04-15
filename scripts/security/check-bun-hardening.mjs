#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const warnings = [];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(
      `No se pudo leer JSON ${path.basename(filePath)}: ${error.message}`,
    );
    return null;
  }
}

function hasUnsafeRange(spec) {
  if (typeof spec !== "string") return true;
  const value = spec.trim();
  return (
    /^(\^|~|>=|<=|>|<)/.test(value) ||
    /^(latest|\*|x|X)$/i.test(value) ||
    /^(workspace:|file:|link:|git\+|https?:)/i.test(value)
  );
}

const packageJsonPath = path.join(root, "package.json");
if (!fs.existsSync(packageJsonPath)) {
  errors.push("Falta package.json en la raíz del proyecto.");
} else {
  const pkg = readJson(packageJsonPath);
  if (pkg) {
    const packageManager = pkg.packageManager;
    if (
      typeof packageManager !== "string" ||
      !/^bun@\d+/.test(packageManager)
    ) {
      errors.push(
        "`packageManager` debe estar fijado a `bun@...` en package.json.",
      );
    }

    const requiredScripts = ["build", "lint", "test"];
    for (const script of requiredScripts) {
      if (
        !pkg.scripts ||
        typeof pkg.scripts[script] !== "string" ||
        !pkg.scripts[script].trim()
      ) {
        errors.push(
          `Falta script requerido en package.json: scripts.${script}`,
        );
      }
    }

    if (Array.isArray(pkg.trustedDependencies)) {
      warnings.push(
        "`trustedDependencies` es específico de pnpm y no se usa en Bun.",
      );
    }

    const depSections = [
      "dependencies",
      "devDependencies",
      "optionalDependencies",
      "peerDependencies",
    ];
    for (const section of depSections) {
      const deps = pkg[section] ?? {};
      for (const [name, spec] of Object.entries(deps)) {
        if (hasUnsafeRange(spec)) {
          errors.push(
            `Dependencia no fijada o fuente insegura en ${section}.${name} = ${spec}`,
          );
        }
      }
    }
  }
}

const lockfiles = ["bun.lock", "bun.lockb"];
if (!lockfiles.some((lockfile) => fs.existsSync(path.join(root, lockfile)))) {
  errors.push(
    "No se encontró lockfile de Bun. Se requiere bun.lock (o bun.lockb).",
  );
}

const bunfigPath = path.join(root, "bunfig.toml");
if (!fs.existsSync(bunfigPath)) {
  warnings.push(
    "No existe bunfig.toml. Considera crearlo para fijar políticas de instalación.",
  );
} else {
  const bunfig = fs.readFileSync(bunfigPath, "utf8");

  if (!/^\s*\[install\]\s*$/m.test(bunfig)) {
    warnings.push("bunfig.toml debería incluir sección [install].");
  }
  if (/^\s*exact\s*=\s*false\s*$/im.test(bunfig)) {
    errors.push(
      "Configuración insegura detectada: exact=false en bunfig.toml.",
    );
  }
  if (/^\s*frozenLockfile\s*=\s*false\s*$/im.test(bunfig)) {
    errors.push(
      "Configuración insegura detectada: frozenLockfile=false en bunfig.toml.",
    );
  }
}

const npmrcPath = path.join(root, ".npmrc");
if (fs.existsSync(npmrcPath)) {
  const npmrc = fs.readFileSync(npmrcPath, "utf8");
  if (/^\s*(save-exact|saveExact)\s*=\s*false\s*$/im.test(npmrc)) {
    errors.push(
      "Configuración insegura detectada: save-exact=false en .npmrc.",
    );
  }
}

console.log("🔐 Verificación de hardening bun/dependencias");
if (warnings.length > 0) {
  for (const warning of warnings) {
    console.warn(`⚠️  ${warning}`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`❌ ${error}`);
  }
  console.error(`\nResultado: FALLA (${errors.length} error(es)).`);
  process.exit(1);
}

console.log("✅ Hardening de bun/dependencias OK.");
