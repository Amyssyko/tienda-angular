#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const candidates = [
  process.env.CHROME_BIN,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter(Boolean);

const selectedBrowser = candidates.find((file) => fs.existsSync(file));
if (selectedBrowser) {
  process.env.CHROME_BIN = selectedBrowser;
  console.log(`🌐 Usando navegador headless: ${selectedBrowser}`);
} else {
  console.warn(
    "⚠️  No se encontró CHROME_BIN localmente. Se intentará launcher por defecto.",
  );
}

const ngCliPath = path.join(
  process.cwd(),
  "node_modules",
  "@angular",
  "cli",
  "bin",
  "ng.js",
);
const result = spawnSync(
  process.execPath,
  [ngCliPath, "test", "--watch=false", "--no-progress"],
  { stdio: "inherit", env: process.env },
);

if (result.error) {
  console.error(`❌ No se pudo ejecutar ng test: ${result.error.message}`);
  process.exit(1);
}

process.exit(Number(result.status ?? 1));
