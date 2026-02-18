<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const auth = useAuthStore();
const isDropdownOpen = ref(false);

const isLoggedIn = computed(() => auth.isAuthenticated.value);
const email = computed(() => auth.user.value?.email || "");
const userInitial = computed(() => email.value.charAt(0).toUpperCase());

function onSignOut() {
  auth.signOut();
  router.push("/login");
  isDropdownOpen.value = false;
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo e Título -->
        <div class="flex items-center gap-8">
          <RouterLink 
            to="/dashboard" 
            class="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
        
            Internal Requests Manager
          </RouterLink>

          <!-- Nav Links -->
          <nav v-if="isLoggedIn" class="hidden sm:flex items-center gap-0">
            <RouterLink
              to="/dashboard"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              Dashboard
              <span class="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </RouterLink>
          </nav>
        </div>

        <!-- User Menu -->
        <div class="flex items-center gap-4">
          <template v-if="isLoggedIn">
            <!-- Dropdown Menu -->
            <div class="relative">
              <button
                type="button"
                @click="toggleDropdown"
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <!-- Avatar -->
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                  {{ userInitial }}
                </div>
                <span class="hidden sm:inline text-sm text-gray-700">{{ email }}</span>
                <svg 
                  class="w-4 h-4 text-gray-600 transition-transform"
                  :class="{ 'rotate-180': isDropdownOpen }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
              </button>

              <!-- Dropdown Panel -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isDropdownOpen"
                  class="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm text-gray-600">Logged in as</p>
                    <p class="text-sm font-semibold text-gray-900 truncate">{{ email }}</p>
                  </div>
                  
                  <button
                    type="button"
                    @click="onSignOut"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Sign out
                  </button>
                </div>
              </transition>
            </div>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-200"
            >
              Sign in
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>
