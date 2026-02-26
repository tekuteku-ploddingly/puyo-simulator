export interface IConnections {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

export interface IPuyo {
  x: number
  y: number
  xColumn: number
  yRow: number
  color: string
  owanimoFlag: boolean // 4つ揃って消える対象かどうか
  connections: IConnections // 隣接する同色ぷよとの接続情報
  setOwanimoFlag: (flag: boolean) => IPuyo // owanimo フラグを更新した新しい Puyo を返す
  setConnections: (connections: IConnections) => IPuyo // 接続情報を更新した新しい Puyo を返す
  dropTo: ({ y }: { y: number }) => IPuyo // 下に落ちた新しい Puyo を返す
  calcRelated: () => IPuyoInfo[] // 連結対象になる座標。13段目は常に空配列を返す（幽霊連鎖）
}

// 座標計算用
export interface IPuyoInfo {
  x: number
  y: number
  color: string
}

const defaultConnections: IConnections = { top: false, right: false, bottom: false, left: false }

export class Puyo implements IPuyo {
  readonly x: number
  readonly y: number
  readonly xColumn: number
  readonly yRow: number
  readonly color: string
  readonly owanimoFlag: boolean
  readonly connections: IConnections

  constructor({
    x,
    y,
    xColumn,
    yRow,
    color,
    owanimoFlag,
    connections,
  }: {
    x: number
    y: number
    xColumn: number
    yRow: number
    color: string
    owanimoFlag: boolean
    connections?: IConnections
  }) {
    this.validate({ x, y, xColumn, yRow })
    this.x = x
    this.y = y
    this.xColumn = xColumn
    this.yRow = yRow
    this.color = color
    this.owanimoFlag = owanimoFlag
    this.connections = connections ?? defaultConnections
  }

  private validate({ x, y }: { x: number; y: number; xColumn: number; yRow: number }): void {
    if (x < 1) {
      throw new Error('x は 1 以上でなければなりません。')
    }
    if (y < 1) {
      throw new Error('y は 1 以上でなければなりません。')
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
    if (up.y >= 1 && up.y < ghostRow) related.push({ x: up.x, y: up.y, color: this.color }) // 幽霊段(ghostRow)は連鎖に参加しないため除外
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
      connections: this.connections,
    })
  }

  // 接続情報を更新した新しい Puyo を返す
  setConnections(connections: IConnections): Puyo {
    return new Puyo({
      x: this.x,
      y: this.y,
      xColumn: this.xColumn,
      yRow: this.yRow,
      color: this.color,
      owanimoFlag: this.owanimoFlag,
      connections,
    })
  }

  // 下に落とす
  dropTo({ y }: { y: number }): Puyo {
    return new Puyo({
      x: this.x,
      y,
      xColumn: this.xColumn,
      yRow: this.yRow,
      color: this.color,
      owanimoFlag: this.owanimoFlag,
    })
  }
}
