<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600">
          Track and manage internal requests in one place.
        </p>
      </div>

      <RouterLink
        to="/requests/new"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        New Request
      </RouterLink>
    </header>

    <section class="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <div class="rounded-xl border bg-white p-4">
        <p class="text-sm text-gray-500">Total</p>
        <p class="mt-1 text-2xl font-semibold">12</p>
      </div>
      <div class="rounded-xl border bg-white p-4">
        <p class="text-sm text-gray-500">Open</p>
        <p class="mt-1 text-2xl font-semibold">5</p>
      </div>
      <div class="rounded-xl border bg-white p-4">
        <p class="text-sm text-gray-500">In Progress</p>
        <p class="mt-1 text-2xl font-semibold">3</p>
      </div>
      <div class="rounded-xl border bg-white p-4">
        <p class="text-sm text-gray-500">Done</p>
        <p class="mt-1 text-2xl font-semibold">4</p>
      </div>
    </section>

    <section class="rounded-xl border bg-white">
      <div class="border-b p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex gap-2">
            <select class="rounded-lg border px-3 py-2 text-sm">
              <option>Status: All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Done</option>
            </select>

            <select class="rounded-lg border px-3 py-2 text-sm">
              <option>Type: All</option>
              <option>Access</option>
              <option>Equipment</option>
              <option>Purchase</option>
              <option>Support</option>
              <option>Other</option>
            </select>
          </div>

          <input
            class="rounded-lg border px-3 py-2 text-sm"
            placeholder="Search requests..."
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="px-4 py-3">Title</th>
              <th class="px-4 py-3">Type</th>
              <th class="px-4 py-3">Priority</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Assignee</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr>
              <td class="px-4 py-3 font-medium text-gray-900">VPN access for contractor</td>
              <td class="px-4 py-3">Access</td>
              <td class="px-4 py-3">High</td>
              <td class="px-4 py-3">
                <span class="rounded-full bg-gray-100 px-2 py-1 text-xs">Open</span>
              </td>
              <td class="px-4 py-3 text-gray-600">—</td>
              <td class="px-4 py-3">
                <RouterLink class="text-blue-600 hover:underline" to="/requests/1/edit">
                  Edit
                </RouterLink>
              </td>
            </tr>

            <tr>
              <td class="px-4 py-3 font-medium text-gray-900">New laptop request</td>
              <td class="px-4 py-3">Equipment</td>
              <td class="px-4 py-3">Medium</td>
              <td class="px-4 py-3">
                <span class="rounded-full bg-gray-100 px-2 py-1 text-xs">In Progress</span>
              </td>
              <td class="px-4 py-3 text-gray-600">Alex</td>
              <td class="px-4 py-3">
                <RouterLink class="text-blue-600 hover:underline" to="/requests/2/edit">
                  Edit
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
