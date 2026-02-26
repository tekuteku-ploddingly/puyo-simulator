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
            :style="{ backgroundColor: p.color, color: p.color, '--bridge-opacity': p.color === '#ffc932' ? 0.7 : 0.4 }"
            :class="[
              'puyo',
              { owanimo: p.owanimoFlag },
              { 'connected-top': p.connections.top },
              { 'connected-right': p.connections.right },
              { 'connected-bottom': p.connections.bottom },
              { 'connected-left': p.connections.left },
            ]"
          ></div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.field-container {
  width: 100%;
}

.field {
  width: 100%;
  aspect-ratio: var(--columns) / var(--rows);
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
  background-image:
    linear-gradient(to right, #e0e0e0 1px, transparent 1px),
    linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
  background-size:
    calc(100% / var(--columns)) calc(100% / var(--rows));
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
}
.puyo {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  position: relative;
  z-index: 1;
}
/* 接続ブリッジ: 薄い色で隣接ぷよとの間をつなぐ */
.puyo.connected-right::after {
  content: '';
  position: absolute;
  background-color: inherit;
  opacity: var(--bridge-opacity, 0.4);
  right: -25%;
  top: 20%;
  width: 25%;
  height: 60%;
  border-radius: 20%;
  z-index: -1;
}
.puyo.connected-top::before {
  content: '';
  position: absolute;
  background-color: inherit;
  opacity: var(--bridge-opacity, 0.4);
  top: -25%;
  left: 20%;
  width: 60%;
  height: 25%;
  border-radius: 20%;
  z-index: -1;
}
.puyo.owanimo {
  background-color: transparent !important;
  border: 3px dashed currentColor;
}
.puyo.owanimo::before,
.puyo.owanimo::after {
  display: none;
}
</style>
