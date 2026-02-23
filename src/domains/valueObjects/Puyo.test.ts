import { describe, it, expect } from 'vitest'
import { Puyo } from './Puyo'

describe('Puyo', () => {
  describe('インスタンス生成とバリデーション', () => {
    it('x が 1 未満のとき、エラーになる', () => {
      expect(() => {
        new Puyo({
          x: 0,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
      }).toThrowError(Error)
    })
    it('x が xColumn より大きいとき、エラーになる', () => {
      expect(() => {
        new Puyo({
          x: 7,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
      }).toThrowError(Error)
    })
    it('y が 1 未満のとき、エラーになる', () => {
      expect(() => {
        new Puyo({
          x: 1,
          y: 0,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
      }).toThrowError(Error)
    })
    it('y が yRow より大きいとき、エラーになる', () => {
      expect(() => {
        new Puyo({
          x: 1,
          y: 15,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
      }).toThrowError(Error)
    })
  })
  describe('隣接する座標を算出する', () => {
    describe('xColumn と yRow が関係ない場合', () => {
      it('(x, y) = (2, 3) のとき、隣接する座標は (1, 3), (3, 3), (2, 2), (2, 4) になる', () => {
        const puyo = new Puyo({
          x: 2,
          y: 3,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
        const related = puyo.calcRelated()
        const relatedCoordinates = related.map((p) => ({ x: p.x, y: p.y }))
        expect(relatedCoordinates).toEqual(
          expect.arrayContaining([
            { x: 1, y: 3 },
            { x: 3, y: 3 },
            { x: 2, y: 2 },
            { x: 2, y: 4 },
          ]),
        )
      })
    })
    describe('ぷよが壁際に置かれる場合（xColumn と yRow が関係する場合）', () => {
      it('左下: (x, y) = (1, 1) のとき、隣接する座標は (1, 2), (2, 1) になる', () => {
        const puyo = new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
        const related = puyo.calcRelated()
        const relatedCoordinates = related.map((p) => ({ x: p.x, y: p.y }))
        expect(relatedCoordinates).toEqual(
          expect.arrayContaining([
            { x: 1, y: 2 },
            { x: 2, y: 1 },
          ]),
        )
      })
      it('右下: (x, y) = (6, 1) のとき、隣接する座標は (5, 1), (6, 2) になる', () => {
        const puyo = new Puyo({
          x: 6,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
        const related = puyo.calcRelated()
        const relatedCoordinates = related.map((p) => ({ x: p.x, y: p.y }))
        expect(relatedCoordinates).toEqual(
          expect.arrayContaining([
            { x: 5, y: 1 },
            { x: 6, y: 2 },
          ]),
        )
      })
      it('左上の画面内の最上段: (x, y) = (1, 12) のとき、隣接する座標は (1, 11), (2, 12) になる', () => {
        const puyo = new Puyo({
          x: 1,
          y: 12,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
        const related = puyo.calcRelated()
        const relatedCoordinates = related.map((p) => ({ x: p.x, y: p.y }))
        expect(relatedCoordinates).toEqual(
          expect.arrayContaining([
            { x: 1, y: 11 },
            { x: 2, y: 12 },
          ]),
        )
      })
      it('右上の画面内の最上段: (x, y) = (6, 12) のとき、隣接する座標は (5, 12), (6, 11) になる', () => {
        const puyo = new Puyo({
          x: 6,
          y: 12,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
        const related = puyo.calcRelated()
        const relatedCoordinates = related.map((p) => ({ x: p.x, y: p.y }))
        expect(relatedCoordinates).toEqual(
          expect.arrayContaining([
            { x: 5, y: 12 },
            { x: 6, y: 11 },
          ]),
        )
      })
    })
    describe('幽霊連鎖(13段目)', () => {
      it('(1, 13) のとき、13段目は連結対象ではないため、空配列を返す', () => {
        const puyo = new Puyo({
          x: 1,
          y: 13,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
        const related = puyo.calcRelated()
        const relatedCoordinates = related.map((p) => ({ x: p.x, y: p.y }))
        expect(relatedCoordinates).toEqual([])
      })
      it('(6, 13) のとき、13段目は連結対象ではないため、空配列を返す', () => {
        const puyo = new Puyo({
          x: 6,
          y: 13,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        })
        const related = puyo.calcRelated()
        const relatedCoordinates = related.map((p) => ({ x: p.x, y: p.y }))
        expect(relatedCoordinates).toEqual([])
      })
    })
  })
})
