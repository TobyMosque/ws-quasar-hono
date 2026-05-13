<template>
  <div>
    <div class="jobs-header">
      <h1 class="jobs-header__title">{{ store.total }} Quasar jobs</h1>
      <p class="jobs-header__subtitle">Find your next Quasar &amp; Vue.js opportunity worldwide</p>
    </div>

    <div v-if="store.loading" class="jobs-loading">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <template v-else>
      <div v-if="store.jobs.length === 0" class="jobs-empty">
        No jobs found. Try adjusting your filters.
      </div>

      <div v-else class="jobs-list">
        <JobCard v-for="job in store.jobs" :key="job.id" :job="job" />
      </div>

      <div v-if="store.total > 25" class="jobs-pagination">
        <q-pagination
          v-model="store.page"
          :max="Math.ceil(store.total / 25)"
          :max-pages="7"
          boundary-numbers
          color="primary"
          @update:model-value="store.fetch()"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import JobCard from "components/JobCard.vue";
import { useJobsStore } from "stores/jobs";

const store = useJobsStore();

await store.fetch();
</script>

<style scoped lang="scss">
.jobs-header {
  margin-bottom: 4px;

  &__title {
    font-size: 24px;
    font-weight: 400;
    letter-spacing: -0.01em;
    margin: 0 0 4px;
  }

  &__subtitle {
    font-size: 13px;
    color: var(--muted);
    margin: 0;
  }
}

.jobs-loading {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}

.jobs-empty {
  text-align: center;
  padding: 64px 0;
  color: var(--muted);
  font-size: 14px;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.jobs-pagination {
  display: flex;
  justify-content: center;
  padding-top: 32px;
}
</style>
