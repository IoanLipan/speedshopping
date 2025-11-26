<template>
  <div class="swipeable-card-wrapper" ref="cardWrapper">
    <!-- Background Actions -->
    <div class="swipe-actions">
      <!-- Left Action: Mark as Bought -->
      <div class="swipe-action swipe-action-left">
        <div class="action-content">
          <CheckCircle :size="32" />
          <span class="action-text">Got it!</span>
        </div>
      </div>

      <!-- Right Action: Need More -->
      <div class="swipe-action swipe-action-right">
        <div class="action-content">
          <PlusCircle :size="32" />
          <span class="action-text">Need more</span>
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div
      ref="card"
      class="shopping-card"
      :class="{ 'swiping-left': swipeDirection === 'left', 'swiping-right': swipeDirection === 'right' }"
      :style="{ transform: `translateX(${offsetX}px)` }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @mousedown="handleMouseDown"
    >
      <!-- Card Header -->
      <div class="card-header">
        <div class="flex items-center gap-3 flex-1">
          <div
            class="item-icon"
            :class="getPriorityClass(item.priority)"
          >
            <ShoppingBag :size="24" />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="item-name">{{ item.name }}</h3>
            <div class="item-meta">
              <span class="meta-badge" :class="getPriorityBadgeClass(item.priority)">
                {{ item.priority.toUpperCase() }}
              </span>
              <span v-if="item.category" class="meta-text">{{ item.category }}</span>
            </div>
          </div>
        </div>

        <div class="item-price">
          {{ formatCurrency((item.price || 0) * item.quantity) }}
        </div>
      </div>

      <!-- Progress Section -->
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-text">
            <span class="font-semibold">{{ item.acquiredQuantity || 0 }}</span> / {{ item.quantity }}
          </span>
          <span class="progress-percentage">{{ progressPercentage }}%</span>
        </div>

        <!-- Progress Bar -->
        <div class="progress-bar-container">
          <div
            class="progress-bar-fill"
            :class="getProgressColorClass(progressPercentage)"
            :style="{ width: `${progressPercentage}%` }"
          >
            <div class="progress-bar-shine"></div>
          </div>
        </div>
      </div>

      <!-- Quick Actions (tap-based for precision) -->
      <div class="quick-actions">
        <button
          @click.stop="handleDecrement"
          :disabled="(item.acquiredQuantity || 0) <= 0"
          class="action-btn action-btn-minus"
          aria-label="Decrease quantity"
        >
          <Minus :size="20" />
        </button>

        <button
          @click.stop="handleIncrement"
          :disabled="(item.acquiredQuantity || 0) >= item.quantity"
          class="action-btn action-btn-check"
          aria-label="Mark one as acquired"
        >
          <Check :size="20" />
          <span>Got 1</span>
        </button>

        <button
          @click.stop="handleNeedMore"
          class="action-btn action-btn-plus"
          aria-label="Need more items"
        >
          <Plus :size="20" />
        </button>
      </div>

      <!-- Swipe Hint (shows on first render) -->
      <div v-if="showSwipeHint" class="swipe-hint">
        <span class="hint-arrow">←</span>
        <span class="hint-text">Swipe for quick actions</span>
        <span class="hint-arrow">→</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ShoppingBag, CheckCircle, PlusCircle, Check, Plus, Minus } from 'lucide-vue-next'
import type { NecessityItem } from '@/types'
import { useSwipeGesture } from '@/composables/useSwipeGesture'
import { formatCurrency } from '@/utils/formatters'

interface Props {
  item: NecessityItem
}

const props = defineProps<Props>()
const emit = defineEmits<{
  increment: []
  decrement: []
  needMore: []
}>()

// Swipe state
const card = ref<HTMLElement | null>(null)
const cardWrapper = ref<HTMLElement | null>(null)
const showSwipeHint = ref(false)

// Use swipe gesture composable
const {
  offsetX,
  swipeDirection,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
} = useSwipeGesture({
  onSwipeLeft: async () => {
    emit('increment')
  },
  onSwipeRight: async () => {
    emit('needMore')
  },
  enableHaptics: true,
})

// Check if user has seen swipe hint before
onMounted(() => {
  const hasSeenHint = localStorage.getItem('hasSeenSwipeHint')
  if (!hasSeenHint) {
    showSwipeHint.value = true
    setTimeout(() => {
      showSwipeHint.value = false
      localStorage.setItem('hasSeenSwipeHint', 'true')
    }, 3000)
  }
})

const progressPercentage = computed(() => {
  const acquired = props.item.acquiredQuantity || 0
  return Math.round((acquired / props.item.quantity) * 100)
})

function getPriorityClass(priority: string) {
  const classes = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low'
  }
  return classes[priority as keyof typeof classes] || 'priority-medium'
}

function getPriorityBadgeClass(priority: string) {
  const classes = {
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low'
  }
  return classes[priority as keyof typeof classes] || 'badge-medium'
}

function getProgressColorClass(percentage: number) {
  if (percentage >= 100) return 'progress-complete'
  if (percentage >= 75) return 'progress-high'
  if (percentage >= 50) return 'progress-medium'
  if (percentage >= 25) return 'progress-low'
  return 'progress-none'
}

function handleIncrement() {
  emit('increment')
}

function handleDecrement() {
  emit('decrement')
}

function handleNeedMore() {
  emit('needMore')
}
</script>

<style scoped>
.swipeable-card-wrapper {
  position: relative;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 16px;
}

.swipe-actions {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
}

.swipe-action {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.swipe-action-left {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0) 100%);
  justify-content: flex-start;
}

.swipe-action-right {
  background: linear-gradient(270deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0) 100%);
  justify-content: flex-end;
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.swiping-left .swipe-action-left .action-content {
  opacity: 1;
  color: #22c55e;
}

.swiping-right .swipe-action-right .action-content {
  opacity: 1;
  color: #f97316;
}

.action-text {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.shopping-card {
  position: relative;
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(55, 65, 81, 0.5);
  border-radius: 16px;
  padding: 16px;
  transition: transform 0.1s ease-out, box-shadow 0.2s;
  touch-action: pan-y;
  cursor: grab;
  min-height: 48px; /* Ensure minimum touch target */
}

.shopping-card:active {
  cursor: grabbing;
}

.shopping-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.item-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.priority-high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.priority-medium {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
}

.priority-low {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #f9fafb;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.badge-high {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-medium {
  background: rgba(249, 115, 22, 0.2);
  color: #fdba74;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.badge-low {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.meta-text {
  font-size: 12px;
  color: #9ca3af;
}

.item-price {
  font-size: 32px;
  font-weight: 700;
  color: #f9fafb;
  flex-shrink: 0;
}

.progress-section {
  margin-bottom: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-text {
  font-size: 24px;
  font-weight: 700;
  color: #f9fafb;
}

.progress-percentage {
  font-size: 18px;
  font-weight: 700;
  color: #d1d5db;
}

.progress-bar-container {
  height: 12px;
  background: rgba(31, 41, 55, 0.8);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-bar-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

.progress-complete {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.progress-high {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.progress-medium {
  background: linear-gradient(90deg, #eab308, #ca8a04);
}

.progress-low {
  background: linear-gradient(90deg, #f97316, #ea580c);
}

.progress-none {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.quick-actions {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  transition: all 0.15s;
  cursor: pointer;
  touch-action: manipulation;
  min-height: 48px; /* Ensure minimum touch target */
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.action-btn:disabled:active {
  transform: none;
}

.action-btn-minus {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.action-btn-minus:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
}

.action-btn-check {
  flex: 1;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  box-shadow: 0 2px 12px rgba(34, 197, 94, 0.3);
}

.action-btn-check:hover:not(:disabled) {
  background: linear-gradient(135deg, #16a34a, #15803d);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
}

.action-btn-plus {
  background: rgba(249, 115, 22, 0.15);
  color: #fdba74;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.action-btn-plus:hover:not(:disabled) {
  background: rgba(249, 115, 22, 0.25);
  border-color: rgba(249, 115, 22, 0.5);
}

.swipe-hint {
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 999px;
  font-size: 11px;
  color: #93c5fd;
  font-weight: 600;
  white-space: nowrap;
  animation: fadeInOut 3s ease-in-out;
}

.hint-arrow {
  font-size: 16px;
  animation: pulse 1.5s ease-in-out infinite;
}

.hint-text {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  10%, 90% { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  .item-price {
    font-size: 24px;
  }

  .progress-text {
    font-size: 20px;
  }

  .action-btn {
    padding: 12px 16px;
  }
}
</style>
