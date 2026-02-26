<script setup lang="ts">
import type { IPuyo } from './../domains/valueObjects/Puyo'

interface IPuyoPair {
  jiku: IPuyo
  child: IPuyo
}

defineProps<{
  nextPuyo: IPuyoPair
  next2Puyo: IPuyoPair
}>()
</script>

<template>
  <div class="next-area">
    <div class="next-label">Next</div>
    <div class="next-pair">
      <div class="puyo" :style="{ backgroundColor: nextPuyo.child.color }"></div>
      <div class="puyo" :style="{ backgroundColor: nextPuyo.jiku.color }"></div>
    </div>
    <div class="next-divider"></div>
    <div class="next-pair">
      <div class="puyo" :style="{ backgroundColor: next2Puyo.child.color }"></div>
      <div class="puyo" :style="{ backgroundColor: next2Puyo.jiku.color }"></div>
    </div>
  </div>
</template>

<style scoped>
.next-area {
  background: #1e2a3a;
  border: 2px solid #4a5568;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.next-label {
  font-size: 10px;
  font-weight: 700;
  color: #a0aec0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.next-pair {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.puyo {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.next-divider {
  width: 100%;
  height: 1px;
  background: #4a556844;
}
</style>
