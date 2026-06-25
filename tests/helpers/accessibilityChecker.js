import { expect } from "@playwright/test";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const aChecker = require("accessibility-checker");
const REPORTS_DIR = path.join("test-results", "accessibility-checker");

async function writeViolationsReport(report, label) {
  const violations = report.results
    .filter((result) => result.level === "violation")
    .map((result) => ({
      ruleId: result.ruleId,
      message: result.message,
      path: result.path,
      snippet: result.snippet,
      help: result.help,
    }));

  const payload = {
    label,
    url: report.summary?.URL,
    scanID: report.scanID,
    counts: {
      violation: report.summary?.counts?.violation ?? violations.length,
    },
    violations,
  };

  await mkdir(REPORTS_DIR, { recursive: true });
  await writeFile(
    path.join(REPORTS_DIR, `${label}-violations.json`),
    `${JSON.stringify(payload, null, 2)}\n`,
  );
}

export async function expectAccessiblePage(page, label) {
  const results = await aChecker.getCompliance(page, label);
  await writeViolationsReport(results.report, label);

  const returnCode = aChecker.assertCompliance(results.report);

  expect(
    returnCode,
    aChecker.stringifyResults(results.report),
  ).toBe(0);
}

export async function closeAccessibilityChecker() {
  await aChecker.close();
}
