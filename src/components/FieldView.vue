<script setup lang="ts">
import type { IPuyo } from './../domains/valueObjects/Puyo'

withDefaults(
  defineProps<{
    xColumn: number
    yRow: number
    displayPuyos: IPuyo[]
  }>(),
  {
    xColumn: 6, // 6列
    yRow: 13, // 13段
    displayPuyos: () => [],
  },
)

// 描画用
</script>

<template>
  <!-- v-for と grid は ONE Based Index -->
  <div class="field-container" :style="{ '--columns': xColumn, '--rows': yRow }">
    <div class="field" :style="{ '--columns': xColumn, '--rows': yRow }">
      <template v-for="y in yRow" :key="y">
        <!-- y軸の反転の調整を grid の order で行う。 y を負数にして絶対値が大きいものを上から描画する -->
        <div v-for="x in xColumn" :key="x" class="cell" :style="{ order: -y }">
          <div
            v-for="p in displayPuyos.filter((p) => p.x === x && p.y === y)"
            :key="p.color"
            :style="{ backgroundColor: p.color, color: p.color }"
            :class="['puyo', { owanimo: p.owanimoFlag }]"
          ></div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.field-container {
  width: 60%;
}

.field {
  width: 100%;
  aspect-ratio: var(--columns) / var(--rows);
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
}
.cell {
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.puyo {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}
.puyo.owanimo {
  background-color: transparent !important;
  border: 3px dashed currentColor;
}
</style>
