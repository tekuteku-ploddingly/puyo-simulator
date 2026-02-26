export interface TemplatePuyo {
  x: number // 1-indexed
  y: number // 1-indexed, 1=底
  color: string // hex color
}

export interface Template {
  name: string
  puyos: TemplatePuyo[]
}

const gtr: Template = {
  name: 'GTR',
  puyos: [
    { x: 1, y: 1, color: '#bd2824' },
    { x: 2, y: 1, color: '#bd2824' },
    { x: 3, y: 2, color: '#bd2824' },
    { x: 2, y: 3, color: '#bd2824' },
    { x: 1, y: 2, color: '#264dd8' },
    { x: 2, y: 2, color: '#264dd8' },
    { x: 1, y: 3, color: '#264dd8' },
  ],
}

const shinGtr: Template = {
  name: '新GTR',
  puyos: [
    { x: 1, y: 1, color: '#bd2824' },
    { x: 2, y: 1, color: '#bd2824' },
    { x: 3, y: 1, color: '#bd2824' },
    { x: 4, y: 2, color: '#bd2824' },
    { x: 3, y: 3, color: '#bd2824' },
    { x: 1, y: 2, color: '#264dd8' },
    { x: 2, y: 2, color: '#264dd8' },
    { x: 3, y: 2, color: '#264dd8' },
  ],
}

const hukigenGTR: Template = {
  name: 'フキゲンGTR',
  puyos: [
    { x: 1, y: 1, color: '#264dd8' },
    { x: 2, y: 1, color: '#bd2824' },
    { x: 3, y: 1, color: '#bd2824' },
    { x: 3, y: 3, color: '#bd2824' },
    { x: 4, y: 2, color: '#bd2824' },
    { x: 2, y: 2, color: '#264dd8' },
    { x: 3, y: 2, color: '#264dd8' },
    { x: 1, y: 2, color: '#288a3b' },
    { x: 1, y: 3, color: '#288a3b' },
    { x: 2, y: 3, color: '#288a3b' },
  ],
}

const persia: Template = {
  name: 'ペルシャ',
  puyos: [
    { x: 1, y: 1, color: '#bd2824' },
    { x: 2, y: 1, color: '#bd2824' },
    { x: 3, y: 1, color: '#bd2824' },
    { x: 4, y: 1, color: '#264dd8' },
    { x: 5, y: 1, color: '#264dd8' },
    { x: 6, y: 1, color: '#264dd8' },
    { x: 2, y: 2, color: '#288a3b' },
    { x: 3, y: 2, color: '#264dd8' },
    { x: 4, y: 2, color: '#288a3b' },
    { x: 3, y: 3, color: '#288a3b' },
    { x: 4, y: 3, color: '#288a3b' },
  ],
}

const deathTower: Template = {
  name: 'デスタワー',
  puyos: [
    { x: 2, y: 1, color: '#264dd8' },
    { x: 3, y: 1, color: '#264dd8' },
    { x: 4, y: 1, color: '#bd2824 ' },
    { x: 4, y: 2, color: '#bd2824 ' },
    { x: 3, y: 2, color: '#bd2824 ' },
    { x: 3, y: 3, color: '#264dd8' },
    { x: 3, y: 4, color: '#264dd8' },
    { x: 3, y: 5, color: '#264dd8' },
    { x: 4, y: 3, color: '#ffc932' },
    { x: 4, y: 4, color: '#ffc932' },
    { x: 4, y: 5, color: '#288a3b' },
    { x: 4, y: 6, color: '#288a3b' },
    { x: 4, y: 7, color: '#bd2824 ' },
    { x: 4, y: 8, color: '#bd2824 ' },
    { x: 5, y: 1, color: '#ffc932' },
    { x: 5, y: 2, color: '#ffc932' },
    { x: 5, y: 3, color: '#288a3b' },
    { x: 5, y: 4, color: '#288a3b' },
    { x: 5, y: 5, color: '#bd2824 ' },
    { x: 5, y: 6, color: '#bd2824 ' },
    { x: 6, y: 1, color: '#ffc932' },
  ],
}

export const templates: Template[] = [gtr, shinGtr, hukigenGTR, persia, deathTower]
