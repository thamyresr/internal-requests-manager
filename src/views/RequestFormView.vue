<script setup>
import { computed, reactive, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRequestsApiStore } from "../stores/requestsApiStore";

const route = useRoute();
const router = useRouter();
const store = useRequestsApiStore();

const requestId = computed(() => route.params.id || null);
const isEdit = computed(() => requestId.value != null);

const notFound = ref(false);
const isSubmitting = ref(false);
const isLoading = ref(false);

const form = reactive({
  title: "",
  description: "",
  type: "Access",
  priority: "Medium",
  status: "Open",
  requester: "You",
  assignee: "",
  dueDate: "",
});

const errors = reactive({
  title: "",
  description: "",
});

function resetForm() {
  form.title = "";
  form.description = "";
  form.type = "Access";
  form.priority = "Medium";
  form.status = "Open";
  form.requester = "You";
  form.assignee = "";
  form.dueDate = "";
}

function validate() {
  errors.title = form.title.trim() ? "" : "Title is required.";
  errors.description =
    form.description.trim().length >= 10
      ? ""
      : "Description must be at least 10 characters.";
  return !errors.title && !errors.description;
}

function toPayload() {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    type: form.type,
    priority: form.priority,
    status: form.status,
    requester: form.requester.trim() || "—",
    assignee: form.assignee.trim(),
    dueDate: form.dueDate,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function onSubmit() {
  if (isSubmitting.value) return;
  if (!validate()) return;

  isSubmitting.value = true;

  try {
    await sleep(800);

    const payload = toPayload();

    if (isEdit.value) {
      const updated = await store.update(requestId.value, payload);
      if (!updated) {
        notFound.value = true;
        return;
      }
    } else {
      await store.create(payload);
    }

    router.push("/dashboard");
  } finally {
    isSubmitting.value = false;
  }
}

function onCancel() {
  router.push("/dashboard");
}

// Load data when editing
watchEffect(() => {
  notFound.value = false;

  if (!isEdit.value) {
    resetForm();
    return;
  }

  const id = requestId.value;

  isLoading.value = true;

  (async () => {
    try {
      const existing = await store.getById(id);
      if (!existing) {
        notFound.value = true;
        return;
      }

      form.title = existing.title || "";
      form.description = existing.description || "";
      form.type = existing.type || "Access";
      form.priority = existing.priority || "Medium";
      form.status = existing.status || "Open";
      form.requester = existing.requester || "You";
      form.assignee = existing.assignee || "";
      form.dueDate = existing.dueDate || "";
    } finally {
      isLoading.value = false;
    }
  })();
});
</script>


<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ isEdit ? "Edit Request" : "New Request" }}
        </h1>
        <p class="mt-1 text-sm text-gray-600">
          {{ isEdit ? "Update request details." : "Create a new internal request." }}
        </p>
      </div>

      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
          @click="onCancel"
        >
          Cancel
        </button>

        <button
          type="button"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isSubmitting"
          @click="onSubmit"
        >
          <span v-if="isSubmitting">{{ isEdit ? "Saving..." : "Creating..." }}</span>
          <span v-else>{{ isEdit ? "Save Changes" : "Create Request" }}</span>
</button>

      </div>
    </header>

    <!-- Not found state (edit mode only) -->
    <section
      v-if="notFound"
      class="rounded-xl border border-red-200 bg-red-50 p-5"
    >
      <h2 class="text-sm font-semibold text-red-800">Request not found</h2>
      <p class="mt-1 text-sm text-red-700">
        The request you are trying to edit does not exist in the current session.
        (This app uses in-memory data; refreshing resets to seed data.)
      </p>

      <button
        type="button"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isSubmitting"
        @click="onCancel"
      >
        Cancel
      </button>
    </section>

    <!-- Form card -->
    <section v-else class="rounded-xl border border-gray-200 bg-white p-5">
      <form class="space-y-5" @submit.prevent="onSubmit">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-900">Title</label>
          <input
            v-model="form.title"
            type="text"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="e.g., VPN access for contractor"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">
            {{ errors.title }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-900">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Provide context, expected outcome, and any relevant details..."
          />
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">
            {{ errors.description }}
          </p>
        </div>

        <!-- Type / Priority -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-900">Type</label>
            <select
              v-model="form.type"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option>Access</option>
              <option>Equipment</option>
              <option>Purchase</option>
              <option>Support</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900">Priority</label>
            <select
              v-model="form.priority"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <!-- Status / Due date -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-900">Status</label>
            <select
              v-model="form.status"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Done</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900">Due date (optional)</label>
            <input
              v-model="form.dueDate"
              type="date"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        <!-- Requester / Assignee -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-900">Requester</label>
            <input
              v-model="form.requester"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="e.g., Thamyres"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900">Assignee (optional)</label>
            <input
              v-model="form.assignee"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="e.g., Alex"
            />
          </div>
        </div>

        <!-- Mobile buttons -->
        <div class="flex gap-2 sm:hidden">
          <button
            type="button"
            class="w-1/2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            @click="onCancel"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="w-1/2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {{ isEdit ? "Save" : "Create" }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
