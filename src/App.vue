<script setup lang="ts">
import FieldWrapper from './components/FieldWrapper.vue'
import ControlPad from './components/ControlPad.vue'
import NextPuyoPanel from './components/NextPuyoPanel.vue'
import TemplateSelector from './components/TemplateSelector.vue'
import { FieldPuyos, type chainStepsIterator } from './domains/entities/FieldPuyos'
import { TsumoPuyo } from './domains/entities/TsumoPuyo'
import { Puyo, type IPuyo } from './domains/valueObjects/Puyo'
import { sleep } from './utils/utils'
import { ref, computed } from 'vue'
import { PuyoFactory } from './domains/entities/PuyoFactory'
import { templates } from './domains/templates'

// One Based Index で列数と段数を指定
const xColumn = 6 // 6列
const yRow = 13 // 13段

let puyoFactory = new PuyoFactory({ numberOfColors: 4 })

// ONE Based Index で puyo の位置を指定
const puyos: IPuyo[] = []
const fieldPuyos = new FieldPuyos(puyos)

const displayPuyos = ref(fieldPuyos.calcConnections(fieldPuyos.puyos)) // 描画用
const isChaining = ref(false) // 連鎖処理中フラグ

// 定型オーバーレイ
const selectedTemplate = ref<string | null>(null)
const showField = ref(true)
const overlayPuyos = computed(() => {
  const t = templates.find((t) => t.name === selectedTemplate.value)
  return t ? t.puyos : []
})

// 連鎖の処理
async function nextStep(stepsIterator: chainStepsIterator) {
  const { done, value } = stepsIterator.next()

  if (done || !value) {
    isChaining.value = false
    return // 連鎖処理が完了
  }
  displayPuyos.value = fieldPuyos.calcConnections(value.puyos) // 描画用に更新
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
function reset() {
  if (isChaining.value) return
  // フィールドをクリア
  fieldPuyos.puyos = []
  displayPuyos.value = []
  // ツモを新しくする
  puyoFactory = new PuyoFactory({ numberOfColors: 4 })
  const { jiku: newJiku, child: newChild } = puyoFactory.tsumoPuyo
  tsumoPuyo.tsumo({
    puyo: [
      new Puyo({ ...newJiku, xColumn: tsumoXColumn, yRow: tsumoYRow }),
      new Puyo({ ...newChild, xColumn: tsumoXColumn, yRow: tsumoYRow }),
    ],
  })
  displayTsumoPuyos.value = [...tsumoPuyo.puyos]
  displayNextPuyo.value = puyoFactory.nextPuyo
  displayNext2Puyo.value = puyoFactory.next2Puyo
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
  displayPuyos.value = fieldPuyos.calcConnections(dropped)

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
        :overlayPuyos="overlayPuyos"
        :showField="showField"
      />
      <div class="side-panel">
        <NextPuyoPanel :nextPuyo="displayNextPuyo" :next2Puyo="displayNext2Puyo" />
        <TemplateSelector
          :templates="templates"
          :selected="selectedTemplate"
          :showField="showField"
          @change="selectedTemplate = $event"
          @update:showField="showField = $event"
        />
        <div class="spacer"></div>
        <button class="menu-btn" @click="reset">Reset</button>
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
  padding: 60px 0;
  box-sizing: border-box;
  max-width: 430px;
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.main-area {
  display: flex;
  gap: 10px;
  width: 100%;
  flex: 1;
  min-height: 0;
}
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 120px;
  flex-shrink: 0;
}
.spacer {
  height: 10px;
}
.menu-btn {
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 6px;
  color: #e2e8f0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 0;
  cursor: pointer;
  text-align: center;
}
.menu-btn:active {
  background: #4a5568;
}
</style>
