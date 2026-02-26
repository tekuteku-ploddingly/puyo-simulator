<script setup lang="ts">
import type { Template } from '../domains/templates'

defineProps<{
  templates: Template[]
  selected: string | null
  showField: boolean
}>()

const emit = defineEmits<{
  change: [name: string | null]
  'update:showField': [value: boolean]
}>()

function toggle(name: string, currentSelected: string | null) {
  emit('change', currentSelected === name ? null : name)
}
</script>

<template>
  <div class="template-selector">
    <label v-for="t in templates" :key="t.name" class="template-option">
      <input type="checkbox" :checked="selected === t.name" @change="toggle(t.name, selected)" />
      {{ t.name }}
    </label>
    <div class="selector-divider"></div>
    <label class="template-option">
      <input type="checkbox" :checked="showField" @change="$emit('update:showField', !showField)" />
      ぷよ表示
    </label>
  </div>
</template>

<style scoped>
.template-selector {
  background: #1e2a3a;
  border: 2px solid #4a5568;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selector-label {
  font-size: 10px;
  font-weight: 700;
  color: #a0aec0;
  letter-spacing: 1px;
}

.template-option {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #e2e8f0;
  cursor: pointer;
}

.selector-divider {
  width: 100%;
  height: 1px;
  background: #4a556844;
}
</style>
