<script setup lang="ts">
withDefaults(
  defineProps<{
    puyo: {
      color: string
      x: number
      y: number
    }[]
    xColumn: number
    yRow: number
  }>(),
  {
    puyo: () => [],
    xColumn: 6, // 6列
    yRow: 14, // 14行
  },
)
</script>

<template>
  <!-- v-for と grid は ONE Based Index -->
  <div class="field" :style="{ '--columns': xColumn, '--rows': yRow }">
    <template v-for="y in yRow" :key="y">
      <!-- y軸の反転の調整を grid の order で行う。 y を負数にして絶対値が大きいものを上から描画する -->
      <div v-for="x in xColumn" :key="x" class="cell" :style="{ order: -y }">
        <div
          v-for="p in puyo.filter((p) => p.x === x && p.y === y)"
          :key="p.color"
          :style="{ backgroundColor: p.color }"
          class="puyo"
        ></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
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
</style>
