import { ref, computed } from "vue";

// Restore user from localStorage (dev-only persistence)
let initial = null;
try {
  const raw = localStorage.getItem("user");
  initial = raw ? JSON.parse(raw) : null;
} catch (e) {
  initial = null;
}

const user = ref(initial);

export function useAuthStore() {
  const isAuthenticated = computed(() => Boolean(user.value));

  function signIn(email) {
    user.value = { email };
    try {
      localStorage.setItem("user", JSON.stringify(user.value));
    } catch (e) {
      /* ignore */
    }
  }

  function signOut() {
    user.value = null;
    try {
      localStorage.removeItem("user");
    } catch (e) {
      /* ignore */
    }
  }

  return {
    user,
    isAuthenticated,
    signIn,
    signOut,
  };
}
