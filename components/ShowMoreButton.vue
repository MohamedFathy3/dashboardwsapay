<!-- components/ShowMoreButton.vue -->
<template>
  <div class="mt-2">
    <button 
      @click="$emit('toggle')" 
      class="btn btn-link btn-sm w-100"
      :class="{ 'active': isExpanded }"
    >
      <i :class="isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  remainingCount: number
  isExpanded: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const buttonText = computed(() => {
  if (props.isExpanded) return "Show Less"
  return `View ${props.remainingCount} More Transaction${props.remainingCount !== 1 ? 's' : ''}`
})
</script>

<style scoped>
.btn-link {
  color: #1f6bc1;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-link:hover {
  color: #0d4a8a;
  background-color: rgba(31, 107, 193, 0.05);
  transform: translateY(-1px);
}

.btn-link i {
  margin-right: 0.5rem;
  font-size: 0.85rem;
  transition: transform 0.2s ease;
}

.btn-link.active i {
  transform: rotate(180deg);
}
</style>