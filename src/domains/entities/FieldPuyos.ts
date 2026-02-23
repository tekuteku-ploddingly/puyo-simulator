import type { IPuyo, IPuyoInfo } from './../valueObjects/Puyo'

interface IFieldPuyos {
  puyos: IPuyo[]
  renketsu: IRenketsuPuyoList // 連結している puyo をまとめる。lenght >= 4 なら消せる
  searchRenketsu: (puyos: IPuyo[]) => IRenketsuPuyoList
  doOwanimo: (puyos: IPuyo[]) => IPuyo[]
}

type IRenketsuPuyoList = IPuyo[][]
type IRenketsuPuyo = IPuyo[]

export class FieldPuyos implements IFieldPuyos {
  puyos: IPuyo[]
  renketsu: IRenketsuPuyoList
  constructor(puyos: IPuyo[]) {
    this.puyos = puyos
    this.renketsu = []
  }
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
    const owanimoPuyos = renketsuPuyoList.filter((renketsu) => renketsu.length >= 4).flat()
    return puyos.map((puyo) => {
      if (owanimoPuyos.some((o) => o.x === puyo.x && o.y === puyo.y)) {
        return puyo.setOwanimoFlag(true)
      }
      return puyo
    })
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
