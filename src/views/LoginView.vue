<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
});

function validate() {
  errors.email = form.email.trim().includes("@") ? "" : "Email is required.";
  errors.password = form.password.trim() ? "" : "Password is required.";
  return !errors.email && !errors.password;
}

function onSubmit() {
  if (!validate()) return;

  auth.signIn(form.email.trim());
  router.push("/dashboard");
}
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center">
    <div class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 class="text-xl font-semibold text-gray-900">Sign in</h1>
      <p class="mt-1 text-sm text-gray-600">
        Demo login (in-memory). Refresh will sign you out.
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-900">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="you@company.com"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="password"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <button
          type="submit"
          class="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign in
        </button>

        <p class="text-xs text-gray-500">
          Any email/password will work.
        </p>
      </form>
    </div>
  </div>
</template>
