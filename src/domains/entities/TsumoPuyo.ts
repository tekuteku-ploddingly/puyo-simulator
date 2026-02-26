import { Puyo, type IPuyo } from './../valueObjects/Puyo'

type tsumoPuyoConfig = {
  jikuX: number
  jikuY: number
  childX: number
  childY: number
}

type rotatoType = 'left' | 'right'

export interface ITsumoPuyo {
  puyos: IPuyo[] // ツモぷよ
  xColumn: number // 6列
  yRow: number // 3段。1回転で3段分のスペースが必要
  tsumo({ puyo, config }: { puyo: IPuyo[]; config?: tsumoPuyoConfig }): void // ツモる
  moveLeft: () => void // 左に
  moveRight: () => void // 右に
  rotateLeft: () => void // 左回転
  rotateRight: () => void // 右回転
  getDropPuyo: ({ fieldYRow }: { fieldYRow: number }) => { jikuPuyo: IPuyo; childPuyo: IPuyo }
  dropPuyo: () => void
}

export class TsumoPuyo implements ITsumoPuyo {
  puyos: IPuyo[]
  xColumn: number
  yRow: number
  constructor({ xColumn, yRow }: { xColumn: number; yRow: number }) {
    this.puyos = []
    this.xColumn = xColumn
    this.yRow = yRow
  }

  // テストのために配置を渡せるようにしているが、普通のアプリケーションコードからは puyo だけ渡せば良い
  tsumo({ puyo, config }: { puyo: IPuyo[]; config?: tsumoPuyoConfig }): void {
    // ツモる。渡されたぷよを初期配置場所に配置する
    const xColumn = this.xColumn
    const yRow = this.yRow
    const jikuX = config?.jikuX ?? 3
    const jikuY = config?.jikuY ?? 2
    const childX = config?.childX ?? 3
    const childY = config?.childY ?? 3
    try {
      const jikuPuyo = puyo[0]
      const childPuyo = puyo[1]
      if (!jikuPuyo || !childPuyo) throw new Error('ツモぷよが不正です。2つのぷよを渡してください')
      const tsumoPuyos = [
        new Puyo({
          x: jikuX,
          y: jikuY,
          xColumn: xColumn,
          yRow: yRow,
          color: jikuPuyo.color,
          owanimoFlag: false,
        }),
        new Puyo({
          x: childX,
          y: childY,
          xColumn: xColumn,
          yRow: yRow,
          color: childPuyo.color,
          owanimoFlag: false,
        }),
      ]
      this.puyos = tsumoPuyos
    } catch (e) {
      console.error(e)
      throw new Error('ツモることができませんでした。')
    }
  }
  // 左に移動する。移動できないときは何もしない
  moveLeft(): void {
    const jikuPuyo = this.puyos[0]
    const childPuyo = this.puyos[1]
    if (!jikuPuyo || !childPuyo) throw new Error('ツモぷよが不正です。2つのぷよが必要です')

    if (jikuPuyo.x > 1 && childPuyo.x > 1) {
      this.puyos = [
        new Puyo({ ...jikuPuyo, x: jikuPuyo.x - 1 }),
        new Puyo({ ...childPuyo, x: childPuyo.x - 1 }),
      ]
    }
  }

  // 右に移動する。移動できないときは何もしない
  moveRight(): void {
    const jikuPuyo = this.puyos[0]
    const childPuyo = this.puyos[1]
    if (!jikuPuyo || !childPuyo) throw new Error('ツモぷよが不正です。2つのぷよが必要です')

    if (jikuPuyo.x < this.xColumn && childPuyo.x < this.xColumn) {
      this.puyos = [
        new Puyo({ ...jikuPuyo, x: jikuPuyo.x + 1 }),
        new Puyo({ ...childPuyo, x: childPuyo.x + 1 }),
      ]
    }
  }

  // 左回転。必要に応じて壁蹴り
  rotateLeft(): void {
    const jikuPuyo = this.puyos[0]
    const childPuyo = this.puyos[1]
    if (!jikuPuyo || !childPuyo) throw new Error('ツモぷよが不正です。2つのぷよが必要です')

    const jikuX = jikuPuyo.x
    const jikuY = jikuPuyo.y
    const childX = childPuyo.x
    const childY = childPuyo.y

    // 回転後の座標を取得
    const { newJikuX, newJikuY, newChildX, newChildY } = this.roteteProcess({
      jikuX,
      jikuY,
      childX,
      childY,
      type: 'left',
    })

    // プロパティを更新
    this.puyos = [
      new Puyo({ ...jikuPuyo, x: newJikuX, y: newJikuY }),
      new Puyo({ ...childPuyo, x: newChildX, y: newChildY }),
    ]
  }

  // 右回転。必要に応じて壁蹴り
  rotateRight(): void {
    const jikuPuyo = this.puyos[0]
    const childPuyo = this.puyos[1]
    if (!jikuPuyo || !childPuyo) throw new Error('ツモぷよが不正です。2つのぷよが必要です')

    const jikuX = jikuPuyo.x
    const jikuY = jikuPuyo.y
    const childX = childPuyo.x
    const childY = childPuyo.y

    // 回転後の座標を取得
    const { newJikuX, newJikuY, newChildX, newChildY } = this.roteteProcess({
      jikuX,
      jikuY,
      childX,
      childY,
      type: 'right',
    })

    this.puyos = [
      new Puyo({ ...jikuPuyo, x: newJikuX, y: newJikuY }),
      new Puyo({ ...childPuyo, x: newChildX, y: newChildY }),
    ]
  }

  // ツモぷよを渡す
  // y座標を調整して返す
  getDropPuyo({ fieldYRow }: { fieldYRow: number }): { jikuPuyo: IPuyo; childPuyo: IPuyo } {
    const jikuPuyo = this.puyos[0]
    const childPuyo = this.puyos[1]
    if (!jikuPuyo || !childPuyo) throw new Error('ツモぷよが不正です。2つのぷよが必要です')
    if (!fieldYRow) throw new Error('フィールドの最大段数を渡してください')

    const jikuX = jikuPuyo.x
    const jikuY = jikuPuyo.y
    const childX = childPuyo.x
    const childY = childPuyo.y

    // 相対座標を取得
    const { dx: _dx, dy } = this.calcRelativeCoordinate({
      jikuX,
      jikuY,
      childX,
      childY,
    })

    // 相対座標に応じて、ツモぷよのy座標を変更
    let newJikuY = fieldYRow
    let newChildY = fieldYRow

    switch (dy) {
      // 初期状態
      // 13段目  子
      // 12段目  軸
      case 1:
        newChildY = fieldYRow
        newJikuY = fieldYRow - 1
        break

      // 1/4 回転
      // 13段目 軸 子
      case 0:
        newJikuY = fieldYRow
        newChildY = fieldYRow
        break

      // 半回転
      // 13段目  軸
      // 12段目  子
      case -1:
        newJikuY = fieldYRow
        newChildY = fieldYRow - 1
        break

      default:
        throw new Error('ツモぷよのdrop座標計算に失敗しました')
    }

    const newJikuPuyo = new Puyo({ ...jikuPuyo, y: newJikuY, yRow: fieldYRow })
    const newChildPuyo = new Puyo({ ...childPuyo, y: newChildY, yRow: fieldYRow })

    return {
      jikuPuyo: newJikuPuyo,
      childPuyo: newChildPuyo,
    }
  }

  // ぷよを落とす…ツモぷよを空配列にする
  dropPuyo(): void {
    this.puyos = []
  }

  // 子ぷよの相対座標を取得
  // 基準点（軸ぷよ）から見て、子ぷよがどこにいるか
  private calcRelativeCoordinate({
    jikuX,
    jikuY,
    childX,
    childY,
  }: {
    jikuX: number
    jikuY: number
    childX: number
    childY: number
  }): { dx: number; dy: number } {
    const dx = childX - jikuX
    const dy = childY - jikuY
    return { dx, dy }
  }
  // 右回転・左回転をしたあとの軸ぷよ・子ぷよの絶対座標を返却
  private roteteProcess({
    jikuX,
    jikuY,
    childX,
    childY,
    type,
  }: {
    jikuX: number
    jikuY: number
    childX: number
    childY: number
    type: rotatoType
  }): { newJikuX: number; newJikuY: number; newChildX: number; newChildY: number } {
    // 子ぷよの相対座標を取得
    const { dx, dy } = this.calcRelativeCoordinate({
      jikuX,
      jikuY,
      childX,
      childY,
    })

    // 子ぷよの移動先の相対座標を計算
    // 移動前の相対座標を (dx, dy) 、移動後の相対座標を (dx', dy') とすると
    // 右回転: dx' =  dy, dy' =  dx
    // 左回転: dx' = -dy, dy' = -dx
    const newDx = type === 'right' ? dy : -dy
    const newDy = type === 'right' ? -dx : dx

    // 子ぷよの移動先の絶対座標を計算
    let newChildX = jikuX + newDx
    const newChildY = jikuY + newDy

    // 壁蹴り
    let newJikuX = jikuX
    // 子ぷよのx軸が0以下なら、子ぷよも軸ぷよも x + 1、右に1つ動かす
    // 子ぷよのx軸が6超過なら、子ぷよも軸ぷよも x - 1、左に1つ動かす
    if (newChildX < 1) {
      newJikuX = jikuX + 1
      newChildX = newChildX + 1
    }
    if (newChildX > this.xColumn) {
      newJikuX = jikuX - 1
      newChildX = newChildX - 1
    }

    // 回転した後の、軸ぷよと子ぷよの絶対座標を返却
    return {
      newJikuX,
      newJikuY: jikuY, // 軸ぷよのY軸は変わらない
      newChildX,
      newChildY,
    }
  }
}
