import { useApi } from "src/composables/api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export type Workplace = "remote" | "hybrid" | "onsite";
export type WorkType = "full-time" | "part-time" | "contract";
export type Seniority = "junior" | "mid" | "senior";

export type Job = {
  id: number;
  title: string;
  description: string;
  workplace: Workplace;
  workType: WorkType;
  seniority: Seniority;
  country: string | null;
  city: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  isFeatured: boolean | null;
  publishedAt: string | null;
  company: { id: number; name: string; logoUrl: string | null; website: string | null };
  technologies: { id: number; name: string }[];
};

export type Filters = {
  q: string;
  workplace: Workplace | "";
  workType: WorkType | "";
  seniority: Seniority | "";
  salaryDisclosed: boolean;
};

export const useJobsStore = defineStore("jobs", () => {
  const api = useApi();
  const jobs = ref<Job[]>([]);
  const total = ref(0);
  const page = ref(1);
  const loading = ref(false);

  const filters = reactive<Filters>({
    q: "",
    workplace: "",
    workType: "",
    seniority: "",
    salaryDisclosed: false,
  });

  async function fetch() {
    loading.value = true;
    try {
      const query: Record<string, string> = {
        page: String(page.value),
        limit: "25",
      };
      if (filters.q) query.q = filters.q;
      if (filters.workplace) query.workplace = filters.workplace;
      if (filters.workType) query.workType = filters.workType;
      if (filters.seniority) query.seniority = filters.seniority;
      if (filters.salaryDisclosed) query.salaryDisclosed = "true";

      const res = await api.api.jobs.$get({ query });
      const data = await res.json();
      jobs.value = data.data as Job[];
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  }

  function resetFilters() {
    filters.q = "";
    filters.workplace = "";
    filters.workType = "";
    filters.seniority = "";
    filters.salaryDisclosed = false;
    page.value = 1;
  }

  return { jobs, total, page, loading, filters, fetch, resetFilters };
});
