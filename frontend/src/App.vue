<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BottomNav from '@/components/BottomNav.vue'

const authStore = useAuthStore()
const route = useRoute()

// Show bottom nav only on authenticated pages
const showBottomNav = computed(() => {
  return authStore.isAuthenticated && route.path !== '/login'
})

onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <div id="app" class="h-screen flex flex-col overflow-hidden">
    <!-- Main content area -->
    <div class="flex-1 overflow-hidden">
      <RouterView />
    </div>
    <!-- Bottom navigation -->
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<style>
/* Global CSS variables for layout calculations */
:root {
  --bottom-nav-height: calc(4rem + env(safe-area-inset-bottom, 0px));
  --safe-area-top: env(safe-area-inset-top, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
