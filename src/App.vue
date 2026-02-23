<script setup lang="ts">
import FieldView from './components/FieldView.vue'

// One Based Index で列数と段数を指定
const xColumn = 6 // 6列
const yRow = 13 // 13段

// ONE Based Index で puyo の位置を指定
const puyo = [
  { color: 'red', x: 1, y: 1 },
  { color: 'green', x: 2, y: 1 },
  { color: 'blue', x: 3, y: 1 },
  { color: 'yellow', x: 4, y: 1 },
]
</script>

<template>
  <header></header>

  <main>
    <FieldView
      :puyo="puyo"
      :xColumn="xColumn"
      :yRow="yRow"
      :style="{ '--columns': xColumn, '--rows': yRow }"
      class="field-container"
    />
  </main>
</template>

<style scoped>
main {
  padding: 20px 0;
  box-sizing: border-box;
  height: 100dvh;
}

/** 40px が画面端からのマージン */
.field-container {
  width: min(100vw, calc((100dvh - 40px) / var(--rows) * var(--columns)));
  height: min(calc(100dvh - 40px), calc(100vw / var(--columns) * var(--rows)));
}
</style>
