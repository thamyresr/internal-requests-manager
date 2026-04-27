// @ts-check
import { test, expect } from "@playwright/test";
import {
  createRequestThroughForm,
  resetTestDatabase,
  signIn,
} from "./helpers/requestTestUtils";

test.beforeEach(resetTestDatabase);

test("deletes a request from the dashboard table", async ({ page }) => {
  const request = {
    title: `Delete request ${Date.now()}`,
    description:
      "Request created before deletion to verify that the dashboard removes it correctly.",
    type: "Access",
    priority: "Medium",
    status: "Open",
    requester: "Amy",
    assignee: "Security Team",
  };

  await signIn(page);
  await createRequestThroughForm(page, request);

  const row = page.getByRole("row", { name: new RegExp(request.title) });
  await expect(row).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());

  const deleteRequestResponse = page.waitForResponse((response) => {
    return (
      response.url().includes("http://localhost:3001/requests/") &&
      response.request().method() === "DELETE" &&
      response.status() === 200
    );
  });

  await row
    .getByRole("button", { name: new RegExp(`Delete request: ${request.title}`) })
    .click();

  await deleteRequestResponse;

  await expect(
    page.getByRole("row", { name: new RegExp(request.title) }),
  ).toHaveCount(0);
});
