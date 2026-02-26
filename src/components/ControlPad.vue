<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    moveLeft: () => void
    moveRight: () => void
    rotateLeft: () => void
    rotateRight: () => void
    drop: () => void
  }>(),
  {
    moveLeft: () => {},
    moveRight: () => {},
    rotateLeft: () => {},
    rotateRight: () => {},
    drop: () => {},
  },
)

function onKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      props.moveLeft()
      break
    case 'ArrowRight':
      e.preventDefault()
      props.moveRight()
      break
    case 'z':
    case 'Z':
      e.preventDefault()
      props.rotateLeft()
      break
    case 'x':
    case 'X':
      e.preventDefault()
      props.rotateRight()
      break
    case 'ArrowDown':
      e.preventDefault()
      props.drop()
      break
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="controls-area">
    <div class="controls-group">
      <!-- Left -->
      <button class="ctrl-btn" aria-label="左移動" @click="moveLeft">
        <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <!-- Right -->
      <button class="ctrl-btn" aria-label="右移動" @click="moveRight">
        <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
      </button>
      <!-- Rotate Left -->
      <button class="ctrl-btn" aria-label="左回転" @click="rotateLeft">
        <svg viewBox="0 0 24 24">
          <path d="M4 12a8 8 0 0 1 14-5.3" />
          <path d="M18 3v4h-4" />
        </svg>
      </button>
      <!-- Rotate Right -->
      <button class="ctrl-btn" aria-label="右回転" @click="rotateRight">
        <svg viewBox="0 0 24 24">
          <path d="M20 12a8 8 0 0 1-14 5.3" />
          <path d="M6 21v-4h4" />
        </svg>
      </button>
    </div>

    <div class="controls-spacer"></div>

    <!-- Drop  -->
    <button class="ctrl-btn drop-btn" aria-label="ドロップ" @click="drop">
      <svg viewBox="0 0 24 24">
        <path d="M12 5v14" />
        <path d="M19 12l-7 7-7-7" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
/* === Controls === */
.controls-area {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 16px 4px;
}

.controls-group {
  display: flex;
  gap: 6px;
}

.controls-spacer {
  flex: 1;
}

.ctrl-btn {
  width: 56px;
  height: 56px;
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  transition:
    background 0.1s,
    transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.ctrl-btn:active {
  background: #4a5568;
  transform: scale(0.93);
}

.ctrl-btn svg {
  width: 24px;
  height: 24px;
  stroke: #e2e8f0;
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ctrl-btn.drop-btn {
  background: #2a2040;
  border-color: #6b46c1;
}

.ctrl-btn.drop-btn:active {
  background: #553c9a;
}
</style>
