<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const auth = useAuthStore();

const isLoggedIn = computed(() => auth.isAuthenticated.value);
const email = computed(() => auth.user.value?.email || "");

function onSignOut() {
  auth.signOut();
  router.push("/login");
}
</script>

<template>
  <header class="border-b bg-white">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <RouterLink to="/dashboard" class="font-semibold text-gray-900 hover:opacity-90">
          Internal Requests Manager
        </RouterLink>

        <RouterLink
          v-if="isLoggedIn"
          to="/dashboard"
          class="text-sm text-gray-600 hover:text-gray-900 hover:underline"
        >
          Dashboard
        </RouterLink>
      </div>

      <div class="flex items-center gap-3">
        <template v-if="isLoggedIn">
          <span class="hidden sm:inline text-sm text-gray-600">{{ email }}</span>

          <button
            type="button"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            @click="onSignOut"
          >
            Sign out
          </button>
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign in
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
