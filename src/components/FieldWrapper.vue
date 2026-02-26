<script setup lang="ts">
import type { IPuyo } from './../domains/valueObjects/Puyo'
import type { TemplatePuyo } from './../domains/templates'
import TsumoZone from './TsumoZone.vue'
import FieldView from './FieldView.vue'
import TemplateOverlay from './TemplateOverlay.vue'

withDefaults(
  defineProps<{
    tsumoPuyos: IPuyo[]
    xColumn: number
    yRow: number
    displayPuyos: IPuyo[]
    overlayPuyos: TemplatePuyo[]
    showField: boolean
  }>(),
  {
    tsumoPuyos: () => [],
    xColumn: 6,
    yRow: 13,
    displayPuyos: () => [],
    overlayPuyos: () => [],
    showField: true,
  },
)
</script>

<template>
  <div class="field-wrapper">
    <TsumoZone :tsumoPuyos="tsumoPuyos" :xColumn="xColumn" />
    <div class="field-area">
      <TemplateOverlay
        v-if="overlayPuyos.length"
        class="field-overlay"
        :xColumn="xColumn"
        :yRow="yRow"
        :puyos="overlayPuyos"
      />
      <FieldView :xColumn="xColumn" :yRow="yRow" :displayPuyos="showField ? displayPuyos : []" />
    </div>
  </div>
</template>

<style scoped>
.field-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  aspect-ratio: 6 / 16;
}
.field-area {
  position: relative;
  width: 100%;
}
.field-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
