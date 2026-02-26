<script setup lang="ts">
import { ref } from 'vue'
import type { InitialPattern } from '../domains/entities/PuyoFactory'

defineProps<{
  selected: InitialPattern | null
}>()

const emit = defineEmits<{
  change: [pattern: InitialPattern | null]
}>()

const isOpen = ref(false)

const patterns: { value: InitialPattern; label: string }[] = [
  { value: 'AA_BB', label: 'AA BB' },
  { value: 'AB_AB', label: 'AB AB' },
  { value: 'AA_BC', label: 'AA BC' },
  { value: 'AB_CC', label: 'AB CC' },
  { value: 'AB_BC', label: 'AB BC' },
  { value: 'AA_AB', label: 'AA AB' },
]

function toggle(value: InitialPattern, currentSelected: InitialPattern | null) {
  emit('change', currentSelected === value ? null : value)
}
</script>

<template>
  <div class="pattern-selector">
    <button class="selector-header" @click="isOpen = !isOpen">
      <span class="selector-label">初手パターン</span>
      <span class="selector-arrow" :class="{ open: isOpen }">▶</span>
    </button>
    <div v-show="isOpen" class="pattern-list">
      <label v-for="p in patterns" :key="p.value" class="pattern-option">
        <input type="checkbox" :checked="selected === p.value" @change="toggle(p.value, selected)" />
        {{ p.label }}
      </label>
    </div>
  </div>
</template>

<style scoped>
.pattern-selector {
  background: #1e2a3a;
  border: 2px solid #4a5568;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 100%;
}

.selector-label {
  font-size: 10px;
  font-weight: 700;
  color: #a0aec0;
  letter-spacing: 1px;
}

.selector-arrow {
  font-size: 10px;
  color: #a0aec0;
  transition: transform 0.2s;
}

.selector-arrow.open {
  transform: rotate(90deg);
}

.pattern-option {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #e2e8f0;
  cursor: pointer;
}
</style>
