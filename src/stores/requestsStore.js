import { ref } from "vue";
import { seedRequests } from "../data/seedRequests";

function cloneSeed() {
  // ensures we don't mutate the original seed array
  return seedRequests.map((r) => ({ ...r }));
}

const requests = ref(cloneSeed());

export function useRequestsStore() {
  function getAll() {
    return requests.value;
  }

  function getById(id) {
    return requests.value.find((r) => r.id === String(id)) || null;
  }

  function create(payload) {
    const now = new Date().toISOString();
    const newItem = {
      id: String(Date.now()),
      createdAt: now,
      ...payload,
    };
    requests.value = [newItem, ...requests.value];
    return newItem;
  }

  function update(id, patch) {
    const targetId = String(id);
    const idx = requests.value.findIndex((r) => r.id === targetId);
    if (idx === -1) return null;

    const updated = { ...requests.value[idx], ...patch };
    const next = [...requests.value];
    next[idx] = updated;
    requests.value = next;

    return updated;
  }

  function remove(id) {
    const targetId = String(id);
    const before = requests.value.length;
    requests.value = requests.value.filter((r) => r.id !== targetId);
    return requests.value.length !== before;
  }

  function reset() {
    requests.value = cloneSeed();
  }

  return {
    requests, // reactive state (ref)
    getAll,
    getById,
    create,
    update,
    remove,
    reset,
  };
}
