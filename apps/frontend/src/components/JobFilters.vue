<template>
  <div class="filters">
    <q-input
      v-model="store.filters.q"
      dense
      outlined
      placeholder="Search jobs..."
      class="filters__search"
      @update:model-value="onFilter"
      clearable
    >
      <template #prepend>
        <q-icon name="search" size="18px" />
      </template>
    </q-input>

    <q-select
      v-model="store.filters.workplace"
      :options="workplaceOptions"
      dense
      outlined
      emit-value
      map-options
      label="Work place"
      class="filters__select"
      @update:model-value="onFilter"
    />

    <q-select
      v-model="store.filters.seniority"
      :options="seniorityOptions"
      dense
      outlined
      emit-value
      map-options
      label="Experience"
      class="filters__select"
      @update:model-value="onFilter"
    />

    <q-select
      v-model="store.filters.workType"
      :options="workTypeOptions"
      dense
      outlined
      emit-value
      map-options
      label="Work type"
      class="filters__select"
      @update:model-value="onFilter"
    />

    <q-toggle
      v-model="store.filters.salaryDisclosed"
      label="Salary disclosed"
      class="filters__toggle"
      @update:model-value="onFilter"
    />

    <q-btn
      v-if="hasActiveFilters"
      flat
      dense
      no-caps
      label="Clear"
      class="filters__clear"
      @click="onClear"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useJobsStore } from "stores/jobs";

const store = useJobsStore();

const workplaceOptions = [
  { label: "Any place", value: "" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "On-site", value: "onsite" },
];

const seniorityOptions = [
  { label: "Any experience", value: "" },
  { label: "Junior", value: "junior" },
  { label: "Mid-level", value: "mid" },
  { label: "Senior", value: "senior" },
];

const workTypeOptions = [
  { label: "Any type", value: "" },
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
];

const hasActiveFilters = computed(
  () =>
    store.filters.q ||
    store.filters.workplace ||
    store.filters.seniority ||
    store.filters.workType ||
    store.filters.salaryDisclosed
);

function onFilter() {
  store.page = 1;
  store.fetch();
}

function onClear() {
  store.resetFilters();
  store.fetch();
}
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 16px 0 20px;

  &__search { flex: 1; min-width: 200px; max-width: 280px; }
  &__select { min-width: 150px; }
  &__toggle { margin-left: 4px; }
  &__clear { color: var(--muted); margin-left: auto; }

  :deep(.q-field__control) {
    background: var(--surface);
    border-radius: var(--radius);
  }

  :deep(.q-field--outlined .q-field__control:before) {
    border-color: var(--border);
  }
}
</style>
