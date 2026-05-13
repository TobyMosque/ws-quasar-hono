<template>
  <q-page class="jobs-page">
    <div class="jobs-page__container">
      <JobFilters />

      <Suspense>
        <JobsPageAsync />

        <template #fallback>
          <div class="jobs-skeleton">
            <q-skeleton type="text" width="160px" height="28px" class="q-mb-xs" />
            <q-skeleton type="text" width="280px" class="q-mb-lg" />
            <div class="jobs-skeleton__list">
              <q-skeleton v-for="n in 8" :key="n" height="110px" />
            </div>
          </div>
        </template>
      </Suspense>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { definePreFetch } from "#q-app"
import JobFilters from "components/JobFilters.vue";
import JobsPageAsync from "components/pages/JobsAsync.vue";

defineOptions({
  preFetch: definePreFetch(() => {
    console.log("Prefetching JobsPage...");
    return Promise.resolve();
  })
});
</script>

<style scoped lang="scss">
.jobs-page {
  &__container {
    max-width: 960px;
    margin: 0 auto;
    padding: 32px 24px 64px;
  }
}

.jobs-skeleton {
  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
