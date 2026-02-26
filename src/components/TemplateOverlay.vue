<script setup lang="ts">
import { computed } from 'vue'
import type { TemplatePuyo } from '../domains/templates'

const props = withDefaults(
  defineProps<{
    xColumn: number
    yRow: number
    puyos: TemplatePuyo[]
  }>(),
  {
    xColumn: 6,
    yRow: 13,
    puyos: () => [],
  },
)

interface Connections {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

const connectionMap = computed(() => {
  const map = new Map<string, Connections>()
  for (const p of props.puyos) {
    const key = `${p.x},${p.y}`
    const connections: Connections = {
      top: props.puyos.some((o) => o.x === p.x && o.y === p.y + 1 && o.color === p.color),
      bottom: props.puyos.some((o) => o.x === p.x && o.y === p.y - 1 && o.color === p.color),
      right: props.puyos.some((o) => o.x === p.x + 1 && o.y === p.y && o.color === p.color),
      left: props.puyos.some((o) => o.x === p.x - 1 && o.y === p.y && o.color === p.color),
    }
    map.set(key, connections)
  }
  return map
})

function getConnections(x: number, y: number): Connections {
  return connectionMap.value.get(`${x},${y}`) ?? { top: false, right: false, bottom: false, left: false }
}

function borderRadius(c: Connections): string {
  // 接続方向は角丸なし(0)、非接続方向は丸く(50%)
  const tl = c.top || c.left ? '0' : '50%'
  const tr = c.top || c.right ? '0' : '50%'
  const br = c.bottom || c.right ? '0' : '50%'
  const bl = c.bottom || c.left ? '0' : '50%'
  return `${tl} ${tr} ${br} ${bl}`
}
</script>

<template>
  <div class="overlay-container" :style="{ '--columns': xColumn, '--rows': yRow }">
    <div class="overlay-grid" :style="{ '--columns': xColumn, '--rows': yRow }">
      <template v-for="y in yRow" :key="y">
        <div v-for="x in xColumn" :key="x" class="cell" :style="{ order: -y }">
          <div
            v-for="p in puyos.filter((p) => p.x === x && p.y === y)"
            :key="p.color"
            class="overlay-puyo"
            :style="{
              backgroundColor: p.color,
              borderRadius: borderRadius(getConnections(x, y)),
            }"
          ></div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.overlay-container {
  width: 100%;
}

.overlay-grid {
  width: 100%;
  aspect-ratio: var(--columns) / var(--rows);
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-puyo {
  width: 100%;
  height: 100%;
  opacity: 0.35;
}
</style>
