import { ref } from "vue";
import * as api from "../services/requestsApi";

const requests = ref([]);

export function useRequestsApiStore() {
  async function load() {
    requests.value = await api.fetchRequests();
  }

  async function getById(id) {
    return api.fetchRequestById(id);
  }

  async function create(payload) {
    const created = await api.createRequest(payload);
    requests.value.unshift(created);
  }

  async function update(id, payload) {
    try {
      const updated = await api.updateRequest(id, payload);
      const index = requests.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        requests.value[index] = updated;
      }
      return updated;
    } catch (err) {
      return null;
    }
  }

  async function remove(id) {
    await api.deleteRequest(id);
    requests.value = requests.value.filter((r) => r.id !== id);
  }

  return {
    requests,
    load,
    getById,
    create,
    update,
    remove,
  };
}
