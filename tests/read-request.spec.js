// @ts-check
import { test, expect } from "@playwright/test";
import {
  createRequestThroughForm,
  resetTestDatabase,
  signIn,
} from "./helpers/requestTestUtils";

test.beforeEach(resetTestDatabase);

test("shows the created request in the dashboard table", async ({ page }) => {
  const request = {
    title: `Dashboard request ${Date.now()}`,
    description:
      "Test focused on validating that the new request appears correctly in the dashboard table.",
    type: "Purchase",
    priority: "Medium",
    status: "In Progress",
    requester: "Amy",
    assignee: "Finance Team",
  };

  await signIn(page);
  await createRequestThroughForm(page, request);

  await expect(page).toHaveURL(/\/dashboard$/);

  // Find the row by its unique title and validate the values visible in the table.
  const row = page.getByRole("row", { name: new RegExp(request.title) });
  await expect(row).toBeVisible();
  await expect(row).toContainText(request.type);
  await expect(row).toContainText(request.priority);
  await expect(row).toContainText(request.status);
  await expect(row).toContainText(request.assignee);
});
