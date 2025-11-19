<template>
  <nav class="bottom-nav">
    <router-link
      v-for="item in navItems"
      :key="item.name"
      :to="item.path"
      class="nav-item"
      :class="{ 'active': isActive(item.path) }"
    >
      <component :is="item.icon" :size="24" />
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home, Package, ShoppingBag, TrendingUp, Settings } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: 'home', path: '/', label: 'Home', icon: Home },
  { name: 'supply', path: '/supply', label: 'Supply', icon: Package },
  { name: 'necessity', path: '/necessity', label: 'Shopping', icon: ShoppingBag },
  { name: 'analytics', path: '/analytics', label: 'Analytics', icon: TrendingUp },
  { name: 'settings', path: '/settings', label: 'Settings', icon: Settings },
]

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.bottom-nav {
  @apply fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700;
  @apply flex items-center justify-around;
  @apply px-2 py-3;
  @apply z-50;
  /* Safe area for mobile devices with notches */
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}

.nav-item {
  @apply flex flex-col items-center gap-1;
  @apply text-gray-400 transition-all duration-150;
  @apply px-4 py-2 rounded-xl;
  @apply hover:bg-gray-700/50;
  @apply min-w-[60px];
}

.nav-item.active {
  @apply text-white;
}

.nav-item:active {
  @apply scale-95;
}

.nav-label {
  @apply text-xs font-medium;
}
</style>
