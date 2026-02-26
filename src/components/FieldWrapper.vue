<script setup lang="ts">
import type { IPuyo } from './../domains/valueObjects/Puyo'
import TsumoZone from './TsumoZone.vue'
import FieldView from './FieldView.vue'

withDefaults(
  defineProps<{
    tsumoPuyos: IPuyo[]
    xColumn: number
    yRow: number
    displayPuyos: IPuyo[]
  }>(),
  {
    tsumoPuyos: () => [],
    xColumn: 6,
    yRow: 13,
    displayPuyos: () => [],
  },
)
</script>

<template>
  <div class="field-wrapper">
    <TsumoZone :tsumoPuyos="tsumoPuyos" :xColumn="xColumn" />
    <FieldView :xColumn="xColumn" :yRow="yRow" :displayPuyos="displayPuyos" />
  </div>
</template>

<style scoped>
.field-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
}
</style>
