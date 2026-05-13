<template>
  <q-page class="job-page">
    <div class="job-page__container">
      <router-link to="/" class="job-page__back">
        <q-icon name="arrow_back" size="16px" />
        All jobs
      </router-link>

      <Suspense>
        <JobPageAsync />

        <template #fallback>
          <div class="job-skeleton">
            <div class="job-skeleton__main">
              <q-skeleton type="text" width="80px" class="q-mb-xs" />
              <q-skeleton type="text" width="60%" height="32px" class="q-mb-md" />
              <div class="job-skeleton__tags">
                <q-skeleton v-for="n in 3" :key="n" type="QBadge" width="64px" height="24px" />
              </div>
              <div class="job-skeleton__techs">
                <q-skeleton v-for="n in 5" :key="n" type="QBadge" width="72px" height="20px" />
              </div>
              <q-skeleton type="text" width="40%" class="q-mb-xl" />
              <q-skeleton type="text" class="q-mb-sm" v-for="n in 8" :key="n" />
            </div>
            <div class="job-skeleton__sidebar">
              <q-skeleton height="160px" />
            </div>
          </div>
        </template>
      </Suspense>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import JobPageAsync from "components/pages/JobAsync.vue";
</script>

<style scoped lang="scss">
.job-page {
  &__container {
    max-width: 960px;
    margin: 0 auto;
    padding: 32px 24px 64px;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 28px;
    transition: color 0.15s;

    &:hover { color: $primary; }
  }
}

.job-skeleton {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    &__sidebar { display: none; }
  }

  &__tags, &__techs {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
  }

  &__techs { gap: 4px; margin-bottom: 20px; }
}
</style>
