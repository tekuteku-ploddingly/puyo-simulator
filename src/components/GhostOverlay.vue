<script setup lang="ts">
import type { IPuyo } from '../domains/valueObjects/Puyo'

withDefaults(
  defineProps<{
    xColumn: number
    yRow: number
    puyos: IPuyo[]
  }>(),
  {
    xColumn: 6,
    yRow: 13,
    puyos: () => [],
  },
)
</script>

<template>
  <div class="overlay-container" :style="{ '--columns': xColumn, '--rows': yRow }">
    <div class="overlay-grid" :style="{ '--columns': xColumn, '--rows': yRow }">
      <template v-for="y in yRow" :key="y">
        <div v-for="x in xColumn" :key="x" class="cell" :style="{ order: -y }">
          <div
            v-for="p in puyos.filter((p) => p.x === x && p.y === y)"
            :key="p.color"
            class="ghost-puyo"
            :style="{ color: p.color }"
          ></div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.overlay-container {
  width: 100%;
}

.overlay-grid {
  width: 100%;
  aspect-ratio: var(--columns) / var(--rows);
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ghost-puyo {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background-color: transparent;
  border: 2px dashed currentColor;
}
</style>
