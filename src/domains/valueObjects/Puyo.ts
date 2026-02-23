export interface IPuyo {
  x: number
  y: number
  xColumn: number
  yRow: number
  color: string
  owanimoFlag: boolean // 4つ揃って消える対象かどうか
  setOwanimoFlag: (flag: boolean) => IPuyo // owanimo フラグを更新した新しい Puyo を返す
  calcRelated: () => IPuyoInfo[] // 連結対象になる座標。13段目は常に空配列を返す（幽霊連鎖）
}

// 座標計算用
export interface IPuyoInfo {
  x: number
  y: number
  color: string
}

export class Puyo implements IPuyo {
  readonly x: number
  readonly y: number
  readonly xColumn: number
  readonly yRow: number
  readonly color: string
  readonly owanimoFlag: boolean

  constructor({
    x,
    y,
    xColumn,
    yRow,
    color,
    owanimoFlag,
  }: {
    x: number
    y: number
    xColumn: number
    yRow: number
    color: string
    owanimoFlag: boolean
  }) {
    this.validate({ x, y, xColumn, yRow })
    this.x = x
    this.y = y
    this.xColumn = xColumn
    this.yRow = yRow
    this.color = color
    this.owanimoFlag = owanimoFlag
  }

  private validate({
    x,
    y,
    xColumn,
    yRow,
  }: {
    x: number
    y: number
    xColumn: number
    yRow: number
  }): void {
    if (x < 1 || x > xColumn) {
      throw new Error(`x は 1 以上 ${xColumn} 以下でなければなりません。`)
    }
    if (y < 1 || y > yRow) {
      throw new Error(`y は 1 以上 ${yRow} 以下でなければなりません。`)
    }
  }

  // 隣接する座標を算出する。13段目は幽霊ぷよなので常に空配列を返す
  // 必要になったら計算する。 Constructor の計算だと無限ループするため
  // この値オブジェクトから剥がしても問題ない
  calcRelated(): IPuyoInfo[] {
    const x = this.x
    const y = this.y
    const xColumn = this.xColumn
    const yRow = this.yRow
    const ghostRow = yRow // 13段目は幽霊ぷよ
    if (y === ghostRow) return [] // 13段目は常に空配列を返す（幽霊ぷよは連鎖に参加しない）
    const related: IPuyoInfo[] = []
    // 左、右、上、下の順番で隣接する座標を算出する
    const left = { x: x - 1, y }
    const right = { x: x + 1, y }
    const up = { x, y: y + 1 }
    const down = { x, y: y - 1 }
    // 有効な座標のみを related に追加する
    // { x: 1, y: 1, color: this.color }
    if (left.x >= 1) related.push({ x: left.x, y: left.y, color: this.color })
    if (right.x <= xColumn) related.push({ x: right.x, y: right.y, color: this.color })
    if (up.y >= 1) related.push({ x: up.x, y: up.y, color: this.color }) // 上は yRow より大きくなることはないため、チェックしない
    if (down.y >= 1 && down.y <= ghostRow) related.push({ x: down.x, y: down.y, color: this.color })
    return related
  }

  // owanimo フラグを true にした新しい Puyo を返す
  setOwanimoFlag(): Puyo {
    return new Puyo({
      x: this.x,
      y: this.y,
      xColumn: this.xColumn,
      yRow: this.yRow,
      color: this.color,
      owanimoFlag: true,
    })
  }
}
