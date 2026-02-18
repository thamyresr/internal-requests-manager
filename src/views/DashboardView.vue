<script setup>
import { computed, ref, onMounted } from "vue";
import { useRequestsApiStore } from "../stores/requestsApiStore";

const store = useRequestsApiStore();

const statusFilter = ref("All");
const typeFilter = ref("All");
const query = ref("");

onMounted(() => {
  store.load();
});

const filteredRequests = computed(() => {
  const q = query.value.trim().toLowerCase();

  return store.requests.value.filter((r) => {
    const matchStatus = statusFilter.value === "All" || r.status === statusFilter.value;
    const matchType = typeFilter.value === "All" || r.type === typeFilter.value;

    const matchQuery =
      !q ||
      (r.title || "").toLowerCase().includes(q) ||
      (r.description || "").toLowerCase().includes(q) ||
      (r.requester || "").toLowerCase().includes(q) ||
      (r.assignee || "").toLowerCase().includes(q);

    return matchStatus && matchType && matchQuery;
  });
});

const stats = computed(() => {
  const all = store.requests.value;
  const count = (s) => all.filter((r) => r.status === s).length;

  return {
    total: all.length,
    open: count("Open"),
    inProgress: count("In Progress"),
    done: count("Done"),
  };
});

function onDelete(id) {
  const ok = confirm("Delete this request?");
  if (!ok) return;
  store.remove(id);
}

function statusClasses(status) {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-700";
    case "In Progress":
      return "bg-amber-100 text-amber-700";
    case "Approved":
      return "bg-emerald-100 text-emerald-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    case "Done":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function priorityClasses(priority) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-amber-100 text-amber-700";
    case "Low":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Requests Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600">
          Track and manage internal requests in one place.
        </p>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <RouterLink
          to="/requests/new"
          class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Request
        </RouterLink>
      </div>
    </header>

    <!-- Summary cards -->
    <section class="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <div class="rounded-xl border border-gray-200 bg-white p-4">
        <p class="text-sm text-gray-500">Total</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">{{ stats.total }}</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-4">
        <p class="text-sm text-gray-500">Open</p>
        <p class="mt-1 text-2xl font-semibold text-blue-700">{{ stats.open }}</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-4">
        <p class="text-sm text-gray-500">In Progress</p>
        <p class="mt-1 text-2xl font-semibold text-amber-700">{{ stats.inProgress }}</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-4">
        <p class="text-sm text-gray-500">Done</p>
        <p class="mt-1 text-2xl font-semibold text-green-700">{{ stats.done }}</p>
      </div>
    </section>

    <!-- Table -->
    <section class="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <!-- Filters -->
      <div class="border-b border-gray-200 p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label class="text-sm text-gray-600">
              <span class="sr-only">Status</span>
              <select
                v-model="statusFilter"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 sm:w-auto"
              >
                <option value="All">Status: All</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Done">Done</option>
              </select>
            </label>

            <label class="text-sm text-gray-600">
              <span class="sr-only">Type</span>
              <select
                v-model="typeFilter"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 sm:w-auto"
              >
                <option value="All">Type: All</option>
                <option value="Access">Access</option>
                <option value="Equipment">Equipment</option>
                <option value="Purchase">Purchase</option>
                <option value="Support">Support</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>

          <label class="w-full sm:w-80">
            <span class="sr-only">Search</span>
            <input
              v-model="query"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Search requests..."
            />
          </label>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredRequests.length === 0" class="p-10 text-center">
        <p class="text-sm text-gray-600">No requests found.</p>
        <RouterLink class="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline" to="/requests/new">
          Create a new request
        </RouterLink>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              <th class="px-4 py-3">Title</th>
              <th class="px-4 py-3">Type</th>
              <th class="px-4 py-3">Priority</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Assignee</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <tr v-for="r in filteredRequests" :key="r.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-900">
                {{ r.title }}
              </td>

              <td class="px-4 py-3 text-gray-700">
                {{ r.type }}
              </td>

              <td class="px-4 py-3">
                <span class="rounded-full px-2 py-1 text-xs font-medium" :class="priorityClasses(r.priority)">
                  {{ r.priority }}
                </span>
              </td>

              <td class="px-4 py-3">
                <span class="rounded-full px-2 py-1 text-xs font-medium" :class="statusClasses(r.status)">
                  {{ r.status }}
                </span>
              </td>

              <td class="px-4 py-3 text-gray-600">
                {{ r.assignee || "—" }}
              </td>

              <td class="px-4 py-3">
                <div class="flex gap-2 items-center">
                  <RouterLink
                    class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    :to="`/requests/${r.id}/edit`"
                    title="Edit request"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </RouterLink>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    @click="onDelete(r.id)"
                    title="Delete request"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
