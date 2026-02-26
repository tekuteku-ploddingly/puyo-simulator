<script setup lang="ts">
import type { IPuyo } from './../domains/valueObjects/Puyo'

withDefaults(
  defineProps<{
    tsumoPuyos: IPuyo[]
    xColumn: number
  }>(),
  {
    tsumoPuyos: () => [],
    xColumn: 6,
  },
)
</script>

<template>
  <div class="tsumo-zone" :style="{ '--columns': xColumn }">
    <template v-for="y in 3" :key="y">
      <div v-for="x in xColumn" :key="x" class="cell" :style="{ order: -y }">
        <div
          v-for="p in tsumoPuyos.filter((p) => p.x === x && p.y === y)"
          :key="p.color"
          :style="{ backgroundColor: p.color }"
          class="puyo"
        ></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tsumo-zone {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-template-rows: repeat(3, 1fr);
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
}
.puyo {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}
</style>
