// @ts-check
import { test, expect } from "@playwright/test";
import {
  closeAccessibilityChecker,
  expectAccessiblePage,
} from "./helpers/accessibilityChecker";
import { resetTestDatabase, signIn, openNewRequestForm } from "./helpers/requestTestUtils";

test.beforeEach(resetTestDatabase);
test.afterEach(closeAccessibilityChecker);

test("creates a request using the form", async ({ page }) => {
  const uniqueTitle = `Playwright request ${Date.now()}`;
  const description =
    "Request created by Playwright to validate the full form submission flow.";

  await signIn(page);
  await openNewRequestForm(page);
  await expectAccessiblePage(page, "create-request-form");

  await page.getByLabel("Title").fill(uniqueTitle);
  await page.getByLabel("Description").fill(description);
  await page.getByLabel("Request type").selectOption("Support");
  await page.getByLabel("Request priority").selectOption("High");
  await page.getByLabel("Request status").selectOption("Open");
  await page.getByLabel("Request requester name").fill("Amy");
  await page.getByLabel("Request assignee name (optional)").fill("TI Team");
  await page.getByLabel("Request due date (optional)").fill("2026-05-15");

  const createRequestResponse = page.waitForResponse((response) => {
    return (
      response.url() === "http://localhost:3001/requests" &&
      response.request().method() === "POST" &&
      response.status() === 201
    );
  });

  await page.getByRole("button", { name: "Create request" }).click();

  const response = await createRequestResponse;
  const createdRequest = await response.json();

  expect(createdRequest).toMatchObject({
    title: uniqueTitle,
    description,
    type: "Support",
    priority: "High",
    status: "Open",
    requester: "Amy",
    assignee: "TI Team",
    dueDate: "2026-05-15",
  });

  await expect(page).toHaveURL(/\/dashboard$/);

  const createdRow = page.getByRole("row", { name: new RegExp(uniqueTitle) });
  await expect(createdRow).toBeVisible();
  await expect(createdRow).toContainText("Support");
  await expect(createdRow).toContainText("TI Team");
});
