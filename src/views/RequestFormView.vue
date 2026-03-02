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
    <header>
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ isEdit ? "Edit Request" : "New Request" }}
      </h1>
      <p class="mt-1 text-sm text-gray-600">
        {{ isEdit ? "Update request details." : "Create a new internal request." }}
      </p>
    </header>

    <!-- Not found state (edit mode only) -->
    <section
      v-if="notFound"
      class="rounded-xl border border-red-200 bg-red-50 p-5"
      role="alert"
      aria-live="polite"
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
      <form class="space-y-5" @submit.prevent="onSubmit" novalidate>
        <!-- Title -->
        <div>
          <label for="form-title" class="block text-sm font-medium text-gray-900">Title</label>
          <input
            id="form-title"
            v-model="form.title"
            type="text"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="e.g., VPN access for contractor"
            :aria-describedby="errors.title ? 'title-error' : undefined"
            required
          />
          <p v-if="errors.title" id="title-error" class="mt-1 text-sm text-red-600" role="alert">
            {{ errors.title }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label for="form-description" class="block text-sm font-medium text-gray-900">Description</label>
          <textarea
            id="form-description"
            v-model="form.description"
            rows="4"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Provide context, expected outcome, and any relevant details..."
            :aria-describedby="errors.description ? 'description-error' : undefined"
            required
          />
          <p v-if="errors.description" id="description-error" class="mt-1 text-sm text-red-600" role="alert">
            {{ errors.description }}
          </p>
        </div>

        <!-- Type / Priority -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="form-type" class="block text-sm font-medium text-gray-900">Type</label>
            <select
              id="form-type"
              v-model="form.type"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="Request type"
            >
              <option>Access</option>
              <option>Equipment</option>
              <option>Purchase</option>
              <option>Support</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label for="form-priority" class="block text-sm font-medium text-gray-900">Priority</label>
            <select
              id="form-priority"
              v-model="form.priority"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="Request priority"
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
            <label for="form-status" class="block text-sm font-medium text-gray-900">Status</label>
            <select
              id="form-status"
              v-model="form.status"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="Request status"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Done</option>
            </select>
          </div>

          <div>
            <label for="form-due-date" class="block text-sm font-medium text-gray-900">Due date (optional)</label>
            <input
              id="form-due-date"
              v-model="form.dueDate"
              type="date"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="Request due date (optional)"
            />
          </div>
        </div>

        <!-- Requester / Assignee -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="form-requester" class="block text-sm font-medium text-gray-900">Requester</label>
            <input
              id="form-requester"
              v-model="form.requester"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="e.g., Thamyres"
              aria-label="Request requester name"
            />
          </div>

          <div>
            <label for="form-assignee" class="block text-sm font-medium text-gray-900">Assignee (optional)</label>
            <input
              id="form-assignee"
              v-model="form.assignee"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="e.g., Alex"
              aria-label="Request assignee name (optional)"
            />
          </div>
        </div>
      </form>
    </section>

    <!-- Form buttons -->
    <div class="flex gap-2 justify-start">
      <button
        type="button"
        class="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        @click="onCancel"
        aria-label="Cancel and return to dashboard"
      >
        Cancel
      </button>

      <button
        type="submit"
        @click="onSubmit"
        class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
        :disabled="isSubmitting"
        :aria-label="isEdit ? 'Save changes' : 'Create request'"
      >
        <span v-if="isSubmitting">{{ isEdit ? "Saving..." : "Creating..." }}</span>
        <span v-else>{{ isEdit ? "Save" : "Create" }}</span>
      </button>
    </div>
  </div>
</template>
