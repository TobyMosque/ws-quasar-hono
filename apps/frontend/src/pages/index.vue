<template>
  <q-layout view="hHh lpr fFf">
    <q-header class="app-header">
      <q-toolbar class="app-header__toolbar">
        <router-link to="/" class="app-header__brand">
          <svg class="app-header__logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 19.5h20L12 2z" fill="currentColor" opacity="0.9"/>
            <path d="M12 8l-5 9.5h10L12 8z" fill="white" opacity="0.25"/>
          </svg>
          <span class="app-header__name">Quasar<strong>Jobs</strong></span>
        </router-link>

        <q-space />

        <span class="app-header__tagline">Quasar &amp; Vue.js jobs worldwide</span>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
//
</script>

<style lang="scss">
.app-header {
  background: linear-gradient(135deg, #1565C0 0%, #1976D2 60%, #1E88E5 100%);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08);

  &__toolbar {
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
    padding: 0 24px;
    min-height: 58px;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: #fff;
  }

  &__logo {
    width: 22px;
    height: 22px;
    color: #80D8FF;
    flex-shrink: 0;
  }

  &__name {
    font-size: 17px;
    letter-spacing: 0.01em;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.92);

    strong {
      font-weight: 600;
      color: #fff;
    }
  }

  &__tagline {
    font-size: 12px;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.38);
    text-transform: uppercase;
  }
}
</style>
