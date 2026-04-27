import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDbPath = path.join(__dirname, "..", "fixtures", "db.e2e.seed.json");
const runtimeDbPath = path.join(__dirname, "..", "fixtures", "db.e2e.json");

export function resetTestDatabase() {
  // Reset the API dataset so each test starts from the same state.
  fs.copyFileSync(seedDbPath, runtimeDbPath);
}

export async function signIn(page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("amy@company.com");
  await page.getByLabel("Password").fill("123456");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(
    page.getByRole("heading", { name: "Requests Dashboard" }),
  ).toBeVisible();
}

export async function openNewRequestForm(page) {
  await page.getByRole("link", { name: "New Request" }).click();

  await expect(
    page.getByRole("heading", { name: "New Request" }),
  ).toBeVisible();
}

export async function createRequestThroughForm(page, request) {
  await openNewRequestForm(page);

  await page.getByLabel("Title").fill(request.title);
  await page.getByLabel("Description").fill(request.description);
  await page.getByLabel("Request type").selectOption(request.type);
  await page.getByLabel("Request priority").selectOption(request.priority);
  await page.getByLabel("Request status").selectOption(request.status);
  await page.getByLabel("Request requester name").fill(request.requester);

  if (request.assignee) {
    await page
      .getByLabel("Request assignee name (optional)")
      .fill(request.assignee);
  }

  if (request.dueDate) {
    await page.getByLabel("Request due date (optional)").fill(request.dueDate);
  }

  await page.getByRole("button", { name: "Create request" }).click();
}
