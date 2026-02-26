<script setup lang="ts">
import FieldWrapper from './components/FieldWrapper.vue'
import ControlPad from './components/ControlPad.vue'
import NextPuyoPanel from './components/NextPuyoPanel.vue'
import { FieldPuyos, type chainStepsIterator } from './domains/entities/FieldPuyos'
import { TsumoPuyo } from './domains/entities/TsumoPuyo'
import { Puyo } from './domains/valueObjects/Puyo'
import { sleep } from './utils/utils'
import { ref } from 'vue'
import { PuyoFactory } from './domains/entities/PuyoFactory'

// One Based Index で列数と段数を指定
const xColumn = 6 // 6列
const yRow = 13 // 13段

const puyoFactory = new PuyoFactory({ numberOfColors: 4 })

// ONE Based Index で puyo の位置を指定
const puyos = [
  new Puyo({ color: '#bd2824', x: 1, y: 1, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: '#bd2824', x: 2, y: 1, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: '#bd2824', x: 3, y: 1, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: '#ffc932', x: 1, y: 2, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: '#ffc932', x: 2, y: 2, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: '#ffc932', x: 3, y: 2, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: '#264dd8', x: 1, y: 3, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: '#264dd8', x: 2, y: 3, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: '#264dd8', x: 3, y: 3, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: '#ffc932', x: 1, y: 4, xColumn, yRow, owanimoFlag: false }),
  new Puyo({ color: '#bd2824', x: 1, y: 5, xColumn, yRow, owanimoFlag: false }),
]
const fieldPuyos = new FieldPuyos(puyos)

const displayPuyos = ref(fieldPuyos.puyos) // 描画用
const isChaining = ref(false) // 連鎖処理中フラグ

// 連鎖の処理
async function nextStep(stepsIterator: chainStepsIterator) {
  const { done, value } = stepsIterator.next()

  if (done || !value) {
    isChaining.value = false
    return // 連鎖処理が完了
  }
  displayPuyos.value = value.puyos // 描画用に更新
  // 0.5秒待って次ステップへ
  await sleep(500)
  nextStep(stepsIterator)
}

// ツモぷよ
const tsumoXColumn = 6
const tsumoYRow = 3
const tsumoPuyo = new TsumoPuyo({ xColumn: tsumoXColumn, yRow: tsumoYRow })
// fixme. ここで変換している
const { jiku, child } = puyoFactory.tsumoPuyo
tsumoPuyo.tsumo({
  puyo: [
    new Puyo({
      ...jiku,
      xColumn: tsumoXColumn,
      yRow: tsumoYRow,
    }),
    new Puyo({
      ...child,
      xColumn: tsumoXColumn,
      yRow: tsumoYRow,
    }),
  ],
})
const displayTsumoPuyos = ref(tsumoPuyo.puyos)
const displayNextPuyo = ref(puyoFactory.nextPuyo)
const displayNext2Puyo = ref(puyoFactory.next2Puyo)

// コントロールパッド
function moveLeft() {
  if (isChaining.value) return
  tsumoPuyo.moveLeft()
  displayTsumoPuyos.value = [...tsumoPuyo.puyos]
}
function moveRight() {
  if (isChaining.value) return
  tsumoPuyo.moveRight()
  displayTsumoPuyos.value = [...tsumoPuyo.puyos]
}
function rotateLeft() {
  if (isChaining.value) return
  tsumoPuyo.rotateLeft()
  displayTsumoPuyos.value = [...tsumoPuyo.puyos]
}
function rotateRight() {
  if (isChaining.value) return
  tsumoPuyo.rotateRight()
  displayTsumoPuyos.value = [...tsumoPuyo.puyos]
}
function drop() {
  if (isChaining.value) return
  const { jikuPuyo, childPuyo } = tsumoPuyo.getDropPuyo({ fieldYRow: yRow })

  // 13段チェック: どちらかの列が満杯なら落とせない
  if (!fieldPuyos.canDropPuyo({ jikuPuyo, childPuyo })) return

  // FieldPuyos に追加する
  const dropJikuPuyo = jikuPuyo
  const dropChildPuyo = childPuyo
  const dropped = fieldPuyos.addDropPuyo({ jikuPuyo: dropJikuPuyo, childPuyo: dropChildPuyo })

  // フィールド描画に反映
  displayPuyos.value = dropped

  // drop に成功したなら、ツモぷよを繰り上げる
  puyoFactory.dropTsumo()
  tsumoPuyo.dropPuyo()
  const { jiku: nextJiku, child: nextChild } = puyoFactory.tsumoPuyo
  tsumoPuyo.tsumo({
    puyo: [
      new Puyo({
        ...nextJiku,
        xColumn: tsumoXColumn,
        yRow: tsumoYRow,
      }),
      new Puyo({
        ...nextChild,
        xColumn: tsumoXColumn,
        yRow: tsumoYRow,
      }),
    ],
  })
  displayTsumoPuyos.value = [...tsumoPuyo.puyos]
  displayNextPuyo.value = puyoFactory.nextPuyo
  displayNext2Puyo.value = puyoFactory.next2Puyo

  // 連鎖の処理に使う
  isChaining.value = true
  const stepsIterator = fieldPuyos.chainSteps()
  nextStep(stepsIterator)
}
</script>

<template>
  <main>
    <div class="main-area">
      <FieldWrapper
        :tsumoPuyos="displayTsumoPuyos"
        :xColumn="xColumn"
        :yRow="yRow"
        :displayPuyos="displayPuyos"
      />
      <div class="side-panel">
        <NextPuyoPanel :nextPuyo="displayNextPuyo" :next2Puyo="displayNext2Puyo" />
      </div>
    </div>
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
.main-area {
  display: flex;
  gap: 10px;
  width: 100%;
}
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80px;
  flex-shrink: 0;
}
</style>
