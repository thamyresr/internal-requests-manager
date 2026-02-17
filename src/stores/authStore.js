import { ref, computed } from "vue";

const user = ref(null);

export function useAuthStore() {
  const isAuthenticated = computed(() => Boolean(user.value));

  function signIn(email) {
    user.value = { email };
  }

  function signOut() {
    user.value = null;
  }

  return {
    user,
    isAuthenticated,
    signIn,
    signOut,
  };
}
