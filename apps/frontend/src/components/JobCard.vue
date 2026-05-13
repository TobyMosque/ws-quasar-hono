<template>
  <router-link :to="`/jobs/${job.id}`" class="job-card" :class="{ 'job-card--featured': job.isFeatured }">
    <div class="job-card__header">
      <span class="job-card__company">{{ job.company.name }}</span>
      <span v-if="job.isFeatured" class="job-card__featured-badge">Featured</span>
    </div>

    <h3 class="job-card__title">{{ job.title }}</h3>

    <div class="job-card__tags">
      <span class="tag tag--workplace">{{ job.workplace }}</span>
      <span class="tag tag--seniority">{{ job.seniority }}</span>
      <span class="tag tag--worktype">{{ job.workType }}</span>
    </div>

    <div class="job-card__techs">
      <span v-for="tech in job.technologies" :key="tech.id" class="tech-chip">
        {{ tech.name }}
      </span>
    </div>

    <div class="job-card__footer">
      <span v-if="job.salaryMin" class="job-card__salary">
        {{ formatSalary(job.salaryMin, job.salaryMax) }}
      </span>
      <span class="job-card__location" v-if="job.country">
        {{ [job.city, job.country].filter(Boolean).join(", ") }}
      </span>
      <span class="job-card__date">{{ timeAgo(job.publishedAt) }}</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Job } from "stores/jobs";

defineProps<{ job: Job }>();

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
  return `${days}d ago`;
}
</script>

<style scoped lang="scss">
.job-card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 24px;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: $primary;
  }

  &--featured {
    border-left: 3px solid $accent;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  &__company {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }

  &__featured-badge {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $accent;
    border: 1px solid $accent;
    padding: 1px 6px;
    border-radius: 2px;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text);
    margin: 0 0 12px;
    line-height: 1.3;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }

  &__techs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 14px;
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: var(--muted);
  }

  &__salary {
    font-weight: 500;
    color: $primary;
  }

  &__date { margin-left: auto; }
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
