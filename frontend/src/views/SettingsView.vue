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
  dashboardTimePeriod: 7, // days for dashboard stock percentage calculations
  skipDays: [] as string[], // ISO date strings for days to skip
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
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-100">Settings</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto px-4 py-6">
      <!-- Account Info -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold text-gray-100 mb-4">Account Information</h2>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              :value="authStore.user?.email"
              disabled
              class="input bg-gray-700 cursor-not-allowed opacity-60"
            />
          </div>
          <div v-if="authStore.user?.displayName">
            <label class="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
            <input
              type="text"
              :value="authStore.user?.displayName"
              disabled
              class="input bg-gray-700 cursor-not-allowed opacity-60"
            />
          </div>
        </div>
      </div>

      <!-- Dashboard Settings -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold text-gray-100 mb-4">Dashboard Settings</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">
              Stock Level Time Period (days)
            </label>
            <select v-model.number="settings.dashboardTimePeriod" class="input">
              <option :value="7">1 Week</option>
              <option :value="14">2 Weeks</option>
              <option :value="21">3 Weeks</option>
              <option :value="30">1 Month</option>
              <option :value="60">2 Months</option>
            </select>
            <p class="text-sm text-gray-400 mt-1">
              Dashboard will show if you have enough stock for this time period
            </p>
          </div>
        </div>
      </div>

      <!-- Vacation/Skip Days Calendar -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold text-gray-100 mb-4">Vacation & Skip Days</h2>
        <div class="space-y-4">
          <p class="text-sm text-gray-400">
            Mark days when you're away (vacation, travel, etc.) so they're not counted in stock consumption calculations.
          </p>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Add Skip Date</label>
            <input
              type="date"
              class="input"
              @change="(e) => {
                const target = e.target as HTMLInputElement
                if (target.value && !settings.skipDays.includes(target.value)) {
                  settings.skipDays.push(target.value)
                  target.value = ''
                }
              }"
            />
          </div>
          <div v-if="settings.skipDays.length > 0" class="space-y-2">
            <label class="block text-sm font-medium text-gray-400 mb-2">Skip Dates:</label>
            <div class="space-y-2">
              <div
                v-for="(date, index) in settings.skipDays"
                :key="date"
                class="flex items-center justify-between bg-gray-700 rounded-lg px-3 py-2"
              >
                <span class="text-sm text-gray-100">{{ new Date(date).toLocaleDateString() }}</span>
                <button
                  @click="settings.skipDays.splice(index, 1)"
                  class="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold text-gray-100 mb-4">Notifications</h2>
        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="font-medium text-gray-100">Email Notifications</span>
            <input
              type="checkbox"
              v-model="settings.emailNotifications"
              class="w-5 h-5 accent-blue-500"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="font-medium text-gray-100">Push Notifications</span>
            <input
              type="checkbox"
              v-model="settings.pushNotifications"
              class="w-5 h-5 accent-blue-500"
            />
          </label>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">
              Low Stock Alert Threshold (days)
            </label>
            <input
              type="number"
              v-model.number="settings.lowStockDays"
              min="1"
              class="input"
            />
            <p class="text-sm text-gray-400 mt-1">
              Get notified when items have this many days or less remaining
            </p>
          </div>
        </div>
      </div>

      <!-- Premium Features -->
      <div class="card mb-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-800">
        <h2 class="text-lg font-semibold text-gray-100 mb-2">Premium Features</h2>
        <p class="text-gray-400 mb-4">
          Unlock real-time price tracking and automatic price alerts
        </p>
        <button class="btn btn-primary">
          Upgrade to Premium
        </button>
      </div>

      <!-- Save Button -->
      <div class="flex items-center gap-4 pb-4">
        <button @click="saveSettings" class="btn btn-primary">
          Save Settings
        </button>
        <span v-if="saveMessage" class="text-green-400 font-medium">
          {{ saveMessage }}
        </span>
      </div>
    </main>
  </div>
</template>
