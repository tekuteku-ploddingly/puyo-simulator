<script setup lang="ts">
import FieldView from './components/FieldView.vue'
import { FieldPuyos } from './domains/entities/FieldPuyos'
import { Puyo } from './domains/valueObjects/Puyo'

// One Based Index で列数と段数を指定
const xColumn = 6 // 6列
const yRow = 13 // 13段

// ONE Based Index で puyo の位置を指定
const puyos = [
  new Puyo({ color: 'red', x: 1, y: 1, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'red', x: 2, y: 1, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'red', x: 3, y: 1, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'yellow', x: 1, y: 2, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'yellow', x: 2, y: 2, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'yellow', x: 3, y: 2, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'blue', x: 1, y: 3, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'blue', x: 2, y: 3, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'blue', x: 3, y: 3, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'yellow', x: 1, y: 4, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'red', x: 1, y: 5, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: 'blue', x: 2, y: 4, xColumn, yRow, owanimoFlag: false }),
]
const fieldPuyos = new FieldPuyos(puyos)
</script>

<template>
  <header></header>

  <main>
    <FieldView
      :xColumn="xColumn"
      :yRow="yRow"
      :style="{ '--columns': xColumn, '--rows': yRow }"
      :fieldPuyos="fieldPuyos"
    />
  </main>
</template>

<style scoped>
main {
  padding: 20px 0;
  box-sizing: border-box;
  height: 100dvh;
}
</style>
