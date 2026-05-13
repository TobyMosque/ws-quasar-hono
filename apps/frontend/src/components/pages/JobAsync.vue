<template>
  <div v-if="store.notFound" class="not-found">Job not found.</div>

  <div v-else-if="store.job" class="job-detail">
    <div class="job-detail__main">
      <span class="job-detail__company">{{ store.job.company.name }}</span>
      <h1 class="job-detail__title">{{ store.job.title }}</h1>

      <div class="job-detail__tags">
        <span class="tag">{{ store.job.workplace }}</span>
        <span class="tag">{{ store.job.seniority }}</span>
        <span class="tag">{{ store.job.workType }}</span>
      </div>

      <div class="job-detail__techs">
        <span v-for="tech in store.job.technologies" :key="tech.id" class="tech-chip">
          {{ tech.name }}
        </span>
      </div>

      <div class="job-detail__meta">
        <span v-if="store.job.salaryMin" class="job-detail__salary">
          {{ formatSalary(store.job.salaryMin, store.job.salaryMax) }}
        </span>
        <span v-if="store.job.country" class="job-detail__location">
          <q-icon name="place" size="14px" />
          {{ [store.job.city, store.job.country].filter(Boolean).join(", ") }}
        </span>
        <span class="job-detail__date">Posted {{ timeAgo(store.job.publishedAt) }}</span>
      </div>

      <q-separator class="job-detail__divider" />

      <div class="job-detail__description">{{ store.job.description }}</div>
    </div>

    <aside class="job-detail__sidebar">
      <div class="job-detail__card">
        <div class="job-detail__company-name">{{ store.job.company.name }}</div>

        <q-btn
          v-if="store.job.company.website"
          :href="store.job.company.website"
          target="_blank"
          outline
          no-caps
          color="primary"
          label="Company website"
          class="q-mt-md full-width"
          size="sm"
        />

        <q-btn
          unelevated
          no-caps
          color="primary"
          label="Apply for this job"
          class="q-mt-sm full-width"
          size="md"
        />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useJobStore } from "stores/job";

const route = useRoute();
const store = useJobStore();

await store.fetch(Number(route.params.id));

onBeforeUnmount(() => store.clear());

function formatSalary(min: number, max: number | null) {
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  return max ? `${fmt(min)} – ${fmt(max)}` : `${fmt(min)}+`;
}

function timeAgo(iso: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}
</script>

<style scoped lang="scss">
.not-found {
  padding: 64px 0;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
}

.job-detail {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  align-items: start;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    .job-detail__sidebar { order: -1; }
  }

  &__company {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }

  &__title {
    font-size: 26px;
    font-weight: 400;
    letter-spacing: -0.02em;
    margin: 6px 0 16px;
    line-height: 1.2;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  &__techs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 20px;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 24px;
  }

  &__salary {
    font-weight: 500;
    color: $primary;
    font-size: 15px;
  }

  &__location {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  &__divider { margin-bottom: 24px; }

  &__description {
    font-size: 14px;
    line-height: 1.8;
    color: var(--text);
    white-space: pre-wrap;
  }

  &__card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    position: sticky;
    top: 24px;
  }

  &__company-name {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 4px;
  }
}

.tag {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: capitalize;
  padding: 3px 8px;
  border-radius: 2px;
  background: #EEEAE4;
  color: var(--text);
}

.tech-chip {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 2px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
}
</style>
