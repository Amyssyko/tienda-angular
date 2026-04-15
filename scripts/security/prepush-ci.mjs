#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";

const packageManagerExec = process.env.npm_execpath;
const runWithNode = Boolean(
  packageManagerExec && /\.(cjs|mjs|js)$/i.test(packageManagerExec),
);

function runPackageManagerStep(label, args, options) {
  if (runWithNode && packageManagerExec) {
    return runStep(
      label,
      process.execPath,
      [packageManagerExec, ...args],
      options,
    );
  }

  if (packageManagerExec) {
    return runStep(label, packageManagerExec, args, options);
  }

  const bunCmd = process.platform === "win32" ? "bun.exe" : "bun";
  return runStep(label, bunCmd, args, options);
}

function runStep(label, command, args, { allowFailure = false, env } = {}) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(command, args, {
    stdio: "pipe",
    encoding: "utf8",
    env: env ?? process.env,
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (output.trim()) {
    process.stdout.write(output);
  }

  const code = Number(result.status ?? 1);
  if (code !== 0 && !allowFailure) {
    console.error(`❌ Step falló: ${label} (exit ${code})`);
    process.exit(code);
  }

  if (code !== 0 && allowFailure) {
    console.warn(`⚠️  Step no bloqueante con error: ${label} (exit ${code})`);
  } else {
    console.log(`✅ ${label}`);
  }

  return { code, output };
}

runPackageManagerStep("security:check-config", [
  "run",
  "security:check-config",
]);
runPackageManagerStep("security:check-exceptions-expiry", [
  "run",
  "security:check-exceptions-expiry",
]);
runPackageManagerStep("lint", ["run", "lint"]);
runPackageManagerStep("build", ["run", "build"]);
runPackageManagerStep("test", ["run", "test"]);

const auditResult = runPackageManagerStep("bun audit (captura)", ["audit"], {
  allowFailure: true,
});
fs.writeFileSync("bun-audit.txt", auditResult.output, "utf8");
console.log("📝 Reporte guardado en bun-audit.txt");

runPackageManagerStep("security:enforce-audit", [
  "run",
  "security:enforce-audit",
  "--",
  "--audit-file",
  "bun-audit.txt",
  "--enforce",
  "true",
]);

if (process.platform === "win32") {
  runStep("Generar SBOM CycloneDX", "cmd.exe", [
    "/d",
    "/s",
    "/c",
    "npm --silent exec --yes @cyclonedx/cyclonedx-npm -- --ignore-npm-errors --output-file sbom.cdx.json",
  ]);
} else {
  runStep("Generar SBOM CycloneDX", "sh", [
    "-lc",
    "npm --silent exec --yes @cyclonedx/cyclonedx-npm -- --ignore-npm-errors --output-file sbom.cdx.json",
  ]);
}

console.log("\n✅ prepush:ci completado.");
