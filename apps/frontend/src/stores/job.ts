import { useApi } from "src/composables/api";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Job } from "./jobs";

export const useJobStore = defineStore("job", () => {
  const api = useApi();
  const job = ref<Job | null>(null);
  const loading = ref(false);
  const notFound = ref(false);

  async function fetch(id: number) {
    loading.value = true;
    notFound.value = false;
    try {
      const res = await api.api.jobs[":id"].$get({ param: { id: String(id) } });
      if (res.status === 404) {
        notFound.value = true;
        return;
      }
      job.value = (await res.json()) as Job;
    } finally {
      loading.value = false;
    }
  }

  function clear() {
    job.value = null;
    notFound.value = false;
  }

  return { job, loading, notFound, fetch, clear };
});
