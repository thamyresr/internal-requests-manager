// @ts-check
import { test, expect } from "@playwright/test";
import {
  createRequestThroughForm,
  resetTestDatabase,
  signIn,
} from "./helpers/requestTestUtils";

test.beforeEach(resetTestDatabase);

test("edits a request from the dashboard table", async ({ page }) => {
  const originalRequest = {
    title: `Edit request ${Date.now()}`,
    description:
      "Request created before editing to validate the full update flow from the dashboard.",
    type: "Support",
    priority: "Low",
    status: "Open",
    requester: "Amy",
    assignee: "Operations Team",
    dueDate: "2026-06-01",
  };

  const updatedRequest = {
    title: `${originalRequest.title} Updated`,
    description:
      "Updated description used to confirm that the edit form saves the new values correctly.",
    type: "Equipment",
    priority: "High",
    status: "In Progress",
    assignee: "IT Team",
    dueDate: "2026-06-15",
  };

  await signIn(page);
  await createRequestThroughForm(page, originalRequest);

  const originalRow = page.getByRole("row", {
    name: new RegExp(originalRequest.title),
  });
  await expect(originalRow).toBeVisible();

  await originalRow
    .getByRole("link", { name: new RegExp(`Edit request: ${originalRequest.title}`) })
    .click();

  await expect(page.getByRole("heading", { name: "Edit Request" })).toBeVisible();

  await page.getByLabel("Title").fill(updatedRequest.title);
  await page.getByLabel("Description").fill(updatedRequest.description);
  await page.getByLabel("Request type").selectOption(updatedRequest.type);
  await page.getByLabel("Request priority").selectOption(updatedRequest.priority);
  await page.getByLabel("Request status").selectOption(updatedRequest.status);
  await page
    .getByLabel("Request assignee name (optional)")
    .fill(updatedRequest.assignee);
  await page.getByLabel("Request due date (optional)").fill(updatedRequest.dueDate);

  const updateRequestResponse = page.waitForResponse((response) => {
    return (
      response.url().includes("http://localhost:3001/requests/") &&
      response.request().method() === "PATCH" &&
      response.status() === 200
    );
  });

  await page.getByRole("button", { name: "Save changes" }).click();

  const response = await updateRequestResponse;
  const updatedPayload = await response.json();

  expect(updatedPayload).toMatchObject(updatedRequest);

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("link", {
      name: `Edit request: ${originalRequest.title}`,
      exact: true,
    }),
  ).toHaveCount(0);

  const updatedRow = page.getByRole("row", {
    name: new RegExp(updatedRequest.title),
  });
  await expect(updatedRow).toBeVisible();
  await expect(updatedRow).toContainText(updatedRequest.type);
  await expect(updatedRow).toContainText(updatedRequest.priority);
  await expect(updatedRow).toContainText(updatedRequest.status);
  await expect(updatedRow).toContainText(updatedRequest.assignee);
});
