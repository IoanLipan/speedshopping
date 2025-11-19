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
  <div id="app" class="min-h-screen flex flex-col">
    <div class="flex-1" :class="{ 'pb-20': showBottomNav }">
      <RouterView />
    </div>
    <BottomNav v-if="showBottomNav" />
  </div>
</template>
