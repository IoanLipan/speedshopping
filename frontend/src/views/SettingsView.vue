<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const settings = ref({
  emailNotifications: true,
  pushNotifications: true,
  email: authStore.user?.email || '',
  lowStockDays: 3,
})

const saveMessage = ref('')

function saveSettings() {
  // TODO: Implement save to backend
  saveMessage.value = 'Settings saved successfully!'
  setTimeout(() => {
    saveMessage.value = ''
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="router.back()" class="btn btn-secondary">
              ← Back
            </button>
            <h1 class="text-2xl font-bold text-primary-600">Settings</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Account Info -->
      <div class="card mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              :value="authStore.user?.email"
              disabled
              class="input bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div v-if="authStore.user?.displayName">
            <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              :value="authStore.user?.displayName"
              disabled
              class="input bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="card mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="font-medium text-gray-900">Email Notifications</span>
            <input
              type="checkbox"
              v-model="settings.emailNotifications"
              class="w-5 h-5"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="font-medium text-gray-900">Push Notifications</span>
            <input
              type="checkbox"
              v-model="settings.pushNotifications"
              class="w-5 h-5"
            />
          </label>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Low Stock Alert Threshold (days)
            </label>
            <input
              type="number"
              v-model.number="settings.lowStockDays"
              min="1"
              class="input"
            />
            <p class="text-sm text-gray-500 mt-1">
              Get notified when items have this many days or less remaining
            </p>
          </div>
        </div>
      </div>

      <!-- Premium Features -->
      <div class="card mb-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Premium Features</h2>
        <p class="text-gray-600 mb-4">
          Unlock real-time price tracking and automatic price alerts
        </p>
        <button class="btn btn-primary">
          Upgrade to Premium
        </button>
      </div>

      <!-- Save Button -->
      <div class="flex items-center gap-4">
        <button @click="saveSettings" class="btn btn-primary">
          Save Settings
        </button>
        <span v-if="saveMessage" class="text-green-600 font-medium">
          {{ saveMessage }}
        </span>
      </div>
    </main>
  </div>
</template>
