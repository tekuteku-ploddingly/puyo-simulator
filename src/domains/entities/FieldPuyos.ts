import type { IPuyo, IPuyoInfo } from './../valueObjects/Puyo'

export type chainStepsIterator = Generator<{ phase: Phase; puyos: IPuyo[] }>

export interface IFieldPuyos {
  puyos: IPuyo[]
  searchRenketsu: (puyos: IPuyo[]) => IRenketsuPuyoList
  doOwanimo: (puyos: IPuyo[]) => IPuyo[]
  chainSteps: () => chainStepsIterator
  addDropPuyo: ({ jikuPuyo, childPuyo }: { jikuPuyo: IPuyo; childPuyo: IPuyo }) => void
}

export type Phase = 'owanimo' | 'drop'

type IRenketsuPuyoList = IPuyo[][]
type IRenketsuPuyo = IPuyo[]

export class FieldPuyos implements IFieldPuyos {
  puyos: IPuyo[]
  constructor(puyos: IPuyo[]) {
    this.puyos = puyos
  }
  canDropPuyo({ jikuPuyo, childPuyo }: { jikuPuyo: IPuyo; childPuyo: IPuyo }): boolean {
    // fixme. yRow をハードコードしている
    const yRow = 13
    const jikuColumnCount = this.puyos.filter((p) => p.x === jikuPuyo.x).length
    const childColumnCount = this.puyos.filter((p) => p.x === childPuyo.x).length
    return jikuColumnCount < yRow && childColumnCount < yRow
  }
  addDropPuyo({ jikuPuyo, childPuyo }: { jikuPuyo: IPuyo; childPuyo: IPuyo }): IPuyo[] {
    this.puyos.push(jikuPuyo)
    this.puyos.push(childPuyo)
    // fixme. xColumn, yRow をハードコードしている
    const dropped = this.dropPuyos({ puyos: this.puyos, xColumn: 6 })
    // 14段目（yRow超え）のぷよを除去
    const trimmed = dropped.filter((p) => p.y <= 13)
    this.puyos = trimmed
    return trimmed
  }
  *chainSteps(): chainStepsIterator {
    while (true) {
      const renketsuPuyoList = this.searchRenketsu(this.puyos)
      const puyosWithFlag = this.setOwanimoFlag({ puyos: this.puyos, renketsuPuyoList })
      if (!puyosWithFlag.some((p) => p.owanimoFlag)) return // もう消すものがない => 連鎖終了 => done = true
      // まだ消すものがある => 連鎖続行 => done = false
      yield { phase: 'owanimo', puyos: puyosWithFlag } // 消える前の状態（点滅用）
      const removed = this.doOwanimo(puyosWithFlag)
      // fixme. xColumn をハードコードしている
      const dropped = this.dropPuyos({ puyos: removed, xColumn: 6 })
      this.puyos = dropped
      yield { phase: 'drop', puyos: dropped } // 落下後の状態
    }
  }
  turnProcess(): void {
    while (true) {
      const renketsuPuyoList = this.searchRenketsu(this.puyos)
      const puyosWithOwanimoFlag = this.setOwanimoFlag({ puyos: this.puyos, renketsuPuyoList })
      if (!puyosWithOwanimoFlag.some((p) => p.owanimoFlag)) break
      const owanimoedPuyos = this.doOwanimo(puyosWithOwanimoFlag)
      // fixme. xColumn をハードコードしている
      this.puyos = this.dropPuyos({ puyos: owanimoedPuyos, xColumn: 6 })
    }
  }
  // 連結しているぷよを探す。複数あれば複数返す。length 4以上なら4連結以上 = 消せる
  searchRenketsu(puyos: IPuyo[]): IRenketsuPuyoList {
    const renketsuPuyoList: IRenketsuPuyoList = []
    const visited: IPuyoInfo[] = []
    // puyos を順番に見ていく
    for (const puyo of puyos) {
      // すでに訪れた puyo はスキップ
      if (visited.some((v) => v.x === puyo.x && v.y === puyo.y)) continue
      // 色
      const color = puyo.color

      // 最初の対象の puyo を訪問済みに追加
      visited.push({ x: puyo.x, y: puyo.y, color: puyo.color })
      // 最初の対象の puyo と連結している puyo を探索
      const related = puyo.calcRelated()

      // 再帰
      const renketsu = this.searchRelated({
        puyos,
        color,
        related,
        visited,
      })
      if (renketsu.length > 0) {
        renketsu.push(puyo) // 最初のぷよが連結してるかを、searchRelated の戻り値が空配列かどうかで判断する
        renketsuPuyoList.push(renketsu)
      }
    }
    return renketsuPuyoList
  }
  setOwanimoFlag({
    puyos,
    renketsuPuyoList,
  }: {
    puyos: IPuyo[]
    renketsuPuyoList: IRenketsuPuyoList
  }): IPuyo[] {
    // 4連結以上の puyo を owanimoFlag = true にする
    const owanimoPuyos = renketsuPuyoList.filter((renketsu) => renketsu.length >= 4).flat()
    return puyos.map((puyo) => {
      if (owanimoPuyos.some((o) => o.x === puyo.x && o.y === puyo.y)) {
        return puyo.setOwanimoFlag(true)
      }
      return puyo
    })
  }
  dropPuyos({ puyos, xColumn }: { puyos: IPuyo[]; xColumn: number }): IPuyo[] {
    // 各列ごとに puyo を落とす
    const result: IPuyo[] = []
    for (let x = 1; x <= xColumn; x++) {
      const puyosInColumn = puyos.filter((p) => p.x === x)
      // 下から順でソートしてから、y を 1 から順番に振り直す
      const sorted = puyosInColumn.sort((a, b) => a.y - b.y)
      sorted.forEach((puyo, index) => {
        const droppedPuyo = puyo.dropTo({ y: index + 1 })
        result.push(droppedPuyo)
      })
    }
    return result
  }

  // 各ぷよの隣接同色接続情報を計算する
  calcConnections(puyos: IPuyo[]): IPuyo[] {
    return puyos.map((puyo) => {
      const top = puyos.some((p) => p.x === puyo.x && p.y === puyo.y + 1 && p.color === puyo.color)
      const bottom = puyos.some((p) => p.x === puyo.x && p.y === puyo.y - 1 && p.color === puyo.color)
      const left = puyos.some((p) => p.x === puyo.x - 1 && p.y === puyo.y && p.color === puyo.color)
      const right = puyos.some((p) => p.x === puyo.x + 1 && p.y === puyo.y && p.color === puyo.color)
      return puyo.setConnections({ top, right, bottom, left })
    })
  }

  // ゴーストピース（着地予測位置）を計算する
  calcGhostPosition({ jikuPuyo, childPuyo }: { jikuPuyo: IPuyo; childPuyo: IPuyo }): IPuyo[] {
    // 各列の最上段 y を求める
    const columnTopY = (x: number): number => {
      const puyosInColumn = this.puyos.filter((p) => p.x === x)
      if (puyosInColumn.length === 0) return 0
      return Math.max(...puyosInColumn.map((p) => p.y))
    }

    if (jikuPuyo.x === childPuyo.x) {
      // 縦並び（同じ列）: 下側が columnTopY + 1、上側が columnTopY + 2
      const topY = columnTopY(jikuPuyo.x)
      const lowerPuyo = jikuPuyo.y < childPuyo.y ? jikuPuyo : childPuyo
      const upperPuyo = jikuPuyo.y < childPuyo.y ? childPuyo : jikuPuyo
      return [
        lowerPuyo.dropTo({ y: topY + 1 }),
        upperPuyo.dropTo({ y: topY + 2 }),
      ]
    } else {
      // 横並び: 各列独立に着地
      const jikuY = columnTopY(jikuPuyo.x) + 1
      const childY = columnTopY(childPuyo.x) + 1
      return [
        jikuPuyo.dropTo({ y: jikuY }),
        childPuyo.dropTo({ y: childY }),
      ]
    }
  }

  doOwanimo(puyos: IPuyo[]): IPuyo[] {
    return puyos.filter((puyo) => !puyo.owanimoFlag)
  }

  // 再帰的に連結している puyo を探索する
  private searchRelated({
    puyos,
    color,
    related,
    visited,
  }: {
    puyos: IPuyo[]
    color: string
    related: IPuyoInfo[]
    visited: IPuyoInfo[]
  }): IRenketsuPuyo {
    const renketsu: IRenketsuPuyo = []
    for (const relatedPuyo of related) {
      // すでに訪れた puyo は探索終了
      if (visited.some((v) => v.x === relatedPuyo.x && v.y === relatedPuyo.y)) continue
      // puyos から対応しているのを取り出す
      const puyo = puyos.find((p) => p.x === relatedPuyo.x && p.y === relatedPuyo.y)
      // 存在しなければ空のセルなので探索終了
      // todo. おじゃまぷよもスキップすべきのため、ここは instanceof IPuyo で判定するべきか
      if (!puyo) continue
      // 色が違う puyo なら探索終了
      if (puyo.color !== color) continue
      // 同じ色
      // 訪れた puyo を visited に追加
      visited.push(relatedPuyo)
      // 色が同じ = 連結している puyo を renketsu に追加
      renketsu.push(puyo)
      // 連結している puyo を再帰的に探索
      const relatedOfRelated = puyo.calcRelated()
      const subRenketsu = this.searchRelated({
        puyos,
        color,
        related: relatedOfRelated,
        visited,
      })
      if (subRenketsu.length > 0) {
        renketsu.push(...subRenketsu)
      }
    }
    return renketsu
  }
}
