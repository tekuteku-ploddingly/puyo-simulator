<script setup lang="ts">
import { ref } from 'vue'
import type { IFieldPuyos } from './../domains/entities/FieldPuyos'
import type { IPuyo } from './../domains/valueObjects/Puyo'
import { sleep } from '../utils/utils'

const props = withDefaults(
  defineProps<{
    xColumn: number
    yRow: number
    fieldPuyos: IFieldPuyos
  }>(),
  {
    xColumn: 6, // 6列
    yRow: 13, // 13段
  },
)

// 連鎖の処理に使う
const stepsIterator = props.fieldPuyos.chainSteps()
// 描画用
const displayPuyos = ref<IPuyo[]>(props.fieldPuyos.puyos)

async function nextStep() {
  const { done, value } = stepsIterator.next()
  if (done || !value) return // 連鎖処理が完了
  displayPuyos.value = value.puyos
  // 0.5秒待って次ステップへ
  await sleep(500)
  nextStep()
}
</script>

<template>
  <!-- v-for と grid は ONE Based Index -->
  <div>
    <button @click="nextStep">start</button>
  </div>
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
/** 40px が画面端からのマージン */
.field-container {
  width: min(100vw, calc((100dvh - 40px) / var(--rows) * var(--columns)));
  height: min(calc(100dvh - 40px), calc(100vw / var(--columns) * var(--rows)));
}

/**
 * 親は FieldView の横幅をcss で指定する
 * FieldView側は指定された横幅いっぱいでグリッドを描画する
**/
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
