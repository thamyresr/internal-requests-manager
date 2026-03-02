<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-6xl mx-auto px-4 py-6" role="main" id="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppHeader from "./components/AppHeader.vue";
</script>
