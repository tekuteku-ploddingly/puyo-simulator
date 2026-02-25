<script setup lang="ts">
import FieldView from './components/FieldView.vue'
import ControlPad from './components/ControlPad.vue'
import { FieldPuyos } from './domains/entities/FieldPuyos'
import { Puyo } from './domains/valueObjects/Puyo'
import { sleep } from './utils/utils'
import { ref } from 'vue'

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

// 連鎖の処理に使う
const stepsIterator = fieldPuyos.chainSteps()
const displayPuyos = ref(fieldPuyos.puyos) // 描画用

async function nextStep() {
  const { done, value } = stepsIterator.next()

  if (done || !value) return // 連鎖処理が完了
  displayPuyos.value = value.puyos // 描画用に更新
  // 0.5秒待って次ステップへ
  await sleep(500)
  nextStep()
}

// コントロールパッド
function moveLeft() {
  console.log('move left')
}
function moveRight() {
  console.log('move right')
}
function rotateLeft() {
  console.log('rotate left')
}
function rotateRight() {
  console.log('rotate right')
}
function drop() {
  console.log('drop')
  nextStep()
}
</script>

<template>
  <header></header>

  <main>
    <FieldView
      :xColumn="xColumn"
      :yRow="yRow"
      :style="{ '--columns': xColumn, '--rows': yRow }"
      :displayPuyos="displayPuyos"
    />
    <ControlPad
      :moveLeft="moveLeft"
      :moveRight="moveRight"
      :rotateLeft="rotateLeft"
      :rotateRight="rotateRight"
      :drop="drop"
    />
  </main>
</template>

<style scoped>
main {
  padding: 20px 0;
  box-sizing: border-box;
  max-width: 430px;
  height: 100dvh;
  margin: 0 auto;
}
</style>
