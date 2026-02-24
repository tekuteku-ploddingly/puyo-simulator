import { describe, it, expect } from 'vitest'
import { FieldPuyos } from './FieldPuyos'
import { Puyo } from './../valueObjects/Puyo'

describe('FieldPuyos', () => {
  describe('turnProcess', () => {
    it('連鎖なし → 1回で抜ける（ぷよがそのまま）', () => {
      // 赤3つ + 青1つ = 4連結なし
      const puyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 2, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 3, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 2, y: 1, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      fieldPuyos.turnProcess()
      const result = fieldPuyos.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 1, y: 1, color: 'red' },
          { x: 1, y: 2, color: 'red' },
          { x: 1, y: 3, color: 'red' },
          { x: 2, y: 1, color: 'blue' },
        ]),
      )
      expect(result).toHaveLength(4)
    })
    it('1連鎖 → 消えて終わる', () => {
      // 赤4連結 + 青1つ → 赤が消えて青だけ残る
      const puyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 2, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 3, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 4, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 2, y: 1, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      fieldPuyos.turnProcess()
      const result = fieldPuyos.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual([{ x: 2, y: 1, color: 'blue' }])
    })
    it('2連鎖以上 → 連鎖が全部消えて止まる', () => {
      // 列1: 赤 赤 赤 赤 青 青 青
      // 列2: 青
      // 1連鎖目: 赤4つ消える → 青3つが落下して (1,1)(1,2)(1,3) に
      // 列2の青 (2,1) と合わせて青4連結 → 2連鎖目で青も消える
      const puyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 2, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 3, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 4, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 5, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
        new Puyo({ x: 1, y: 6, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
        new Puyo({ x: 1, y: 7, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
        new Puyo({ x: 2, y: 1, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      fieldPuyos.turnProcess()
      expect(fieldPuyos.puyos).toEqual([])
    })
    it('幽霊連鎖: 13段目は幽霊のため、ぷよがくっついていても消えない', () => {
      const puyos = [
        // 赤は発火
        // 緑は13段目で幽霊 → 2連鎖目で消える
        // よって黄色と青が残る
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 2, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 3, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 2, y: 1, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 4, xColumn: 6, yRow: 13, color: 'yellow', owanimoFlag: false }),
        new Puyo({ x: 1, y: 5, xColumn: 6, yRow: 13, color: 'yellow', owanimoFlag: false }),
        new Puyo({ x: 1, y: 6, xColumn: 6, yRow: 13, color: 'yellow', owanimoFlag: false }),
        new Puyo({ x: 1, y: 7, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
        new Puyo({ x: 1, y: 8, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
        new Puyo({ x: 1, y: 9, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
        new Puyo({ x: 1, y: 10, xColumn: 6, yRow: 13, color: 'green', owanimoFlag: false }),
        new Puyo({ x: 1, y: 11, xColumn: 6, yRow: 13, color: 'green', owanimoFlag: false }),
        new Puyo({ x: 1, y: 12, xColumn: 6, yRow: 13, color: 'green', owanimoFlag: false }),
        new Puyo({ x: 1, y: 13, xColumn: 6, yRow: 13, color: 'green', owanimoFlag: false }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      fieldPuyos.turnProcess()
      const result = fieldPuyos.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 1, y: 1, color: 'yellow' },
          { x: 1, y: 2, color: 'yellow' },
          { x: 1, y: 3, color: 'yellow' },
          { x: 1, y: 4, color: 'blue' },
          { x: 1, y: 5, color: 'blue' },
          { x: 1, y: 6, color: 'blue' },
        ]),
      )
    })
  })
  describe('searchRenketsu', () => {
    it('連結している puyo を取得', () => {
      const puyos = [
        new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 3,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 4,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 3,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const result = fieldPuyos.searchRenketsu(puyos)
      const resultMapped = result.map((group) =>
        group.map((p) => ({ x: p.x, y: p.y, color: p.color })),
      )
      expect(resultMapped).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([
            { x: 1, y: 1, color: 'red' },
            { x: 1, y: 2, color: 'red' },
            { x: 1, y: 3, color: 'red' },
          ]),
          expect.arrayContaining([
            { x: 2, y: 1, color: 'blue' },
            { x: 2, y: 2, color: 'blue' },
            { x: 2, y: 3, color: 'blue' },
          ]),
        ]),
      )
    })
    it('連結している puyo がない場合は空配列を返す', () => {
      const puyos = [
        new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const result = fieldPuyos.searchRenketsu(puyos)
      expect(result).toEqual([])
    })
    // 連結ぷよを消すかどうかの判定は関心の外
    it('4連結以上でもそのまま連結している puyo を返す', () => {
      const puyos = [
        new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 3,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 4,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const result = fieldPuyos.searchRenketsu(puyos)
      const resultMapped = result.map((group) =>
        group.map((p) => ({ x: p.x, y: p.y, color: p.color })),
      )
      expect(resultMapped).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([
            { x: 1, y: 1, color: 'red' },
            { x: 1, y: 2, color: 'red' },
            { x: 1, y: 3, color: 'red' },
            { x: 1, y: 4, color: 'red' },
          ]),
        ]),
      )
    })
    it('幽霊連鎖: 13段目は連結対象としない', () => {
      const puyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 2, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 3, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 2, y: 1, xColumn: 6, yRow: 13, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 4, xColumn: 6, yRow: 13, color: 'yellow', owanimoFlag: false }),
        new Puyo({ x: 1, y: 5, xColumn: 6, yRow: 13, color: 'yellow', owanimoFlag: false }),
        new Puyo({ x: 1, y: 6, xColumn: 6, yRow: 13, color: 'yellow', owanimoFlag: false }),
        new Puyo({ x: 1, y: 7, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
        new Puyo({ x: 1, y: 8, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
        new Puyo({ x: 1, y: 9, xColumn: 6, yRow: 13, color: 'blue', owanimoFlag: false }),
        new Puyo({ x: 1, y: 10, xColumn: 6, yRow: 13, color: 'green', owanimoFlag: false }),
        new Puyo({ x: 1, y: 11, xColumn: 6, yRow: 13, color: 'green', owanimoFlag: false }),
        new Puyo({ x: 1, y: 12, xColumn: 6, yRow: 13, color: 'green', owanimoFlag: false }),
        new Puyo({ x: 1, y: 13, xColumn: 6, yRow: 13, color: 'green', owanimoFlag: false }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const result = fieldPuyos.searchRenketsu(puyos)
      const resultMapped = result.map((group) =>
        group.map((p) => ({ x: p.x, y: p.y, color: p.color })),
      )
      expect(resultMapped).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([
            { x: 1, y: 1, color: 'red' },
            { x: 1, y: 2, color: 'red' },
            { x: 1, y: 3, color: 'red' },
            { x: 2, y: 1, color: 'red' },
          ]),
          expect.arrayContaining([
            { x: 1, y: 4, color: 'yellow' },
            { x: 1, y: 5, color: 'yellow' },
            { x: 1, y: 6, color: 'yellow' },
          ]),
          expect.arrayContaining([
            { x: 1, y: 7, color: 'blue' },
            { x: 1, y: 8, color: 'blue' },
            { x: 1, y: 9, color: 'blue' },
          ]),
          // 13段目は幽霊のため、連結対象としない → 緑は4つ並んでいるが連結とはならない
          expect.arrayContaining([
            { x: 1, y: 10, color: 'green' },
            { x: 1, y: 11, color: 'green' },
            { x: 1, y: 12, color: 'green' },
          ]),
        ]),
      )
    })
  })
  describe('4連結以上のぷよに owanimoFlag を立てる', () => {
    it('4連結以上のぷよに owanimoFlag を立てる', () => {
      const puyos = [
        new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 3,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 4,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const renketsuPuyoList = fieldPuyos.searchRenketsu(puyos)
      const result = fieldPuyos.setOwanimoFlag({ puyos, renketsuPuyoList })
      const resultMapped = result.map((p) => ({
        x: p.x,
        y: p.y,
        color: p.color,
        owanimoFlag: p.owanimoFlag,
      }))
      expect(resultMapped).toEqual(
        expect.arrayContaining([
          { x: 1, y: 1, color: 'red', owanimoFlag: true },
          { x: 1, y: 2, color: 'red', owanimoFlag: true },
          { x: 1, y: 3, color: 'red', owanimoFlag: true },
          { x: 1, y: 4, color: 'red', owanimoFlag: true },
          { x: 2, y: 1, color: 'blue', owanimoFlag: false },
        ]),
      )
    })
    it('3連結は owanimoFlag を立てない', () => {
      const puyos = [
        new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 3,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const renketsuPuyoList = fieldPuyos.searchRenketsu(puyos)
      const result = fieldPuyos.setOwanimoFlag({ puyos, renketsuPuyoList })
      const resultMapped = result.map((p) => ({
        x: p.x,
        y: p.y,
        color: p.color,
        owanimoFlag: p.owanimoFlag,
      }))
      expect(resultMapped).toEqual(
        expect.arrayContaining([
          { x: 1, y: 1, color: 'red', owanimoFlag: false },
          { x: 1, y: 2, color: 'red', owanimoFlag: false },
          { x: 1, y: 3, color: 'red', owanimoFlag: false },
          { x: 2, y: 1, color: 'blue', owanimoFlag: false },
        ]),
      )
    })
    it('5連結以上のぷよも owanimoFlag を立てる', () => {
      const puyos = [
        new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 3,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 4,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 5,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const renketsuPuyoList = fieldPuyos.searchRenketsu(puyos)
      const result = fieldPuyos.setOwanimoFlag({ puyos, renketsuPuyoList })
      const resultMapped = result.map((p) => ({
        x: p.x,
        y: p.y,
        color: p.color,
        owanimoFlag: p.owanimoFlag,
      }))
      expect(resultMapped).toEqual(
        expect.arrayContaining([
          { x: 1, y: 1, color: 'red', owanimoFlag: true },
          { x: 1, y: 2, color: 'red', owanimoFlag: true },
          { x: 1, y: 3, color: 'red', owanimoFlag: true },
          { x: 1, y: 4, color: 'red', owanimoFlag: true },
          { x: 1, y: 5, color: 'red', owanimoFlag: true },
          { x: 2, y: 1, color: 'blue', owanimoFlag: false },
        ]),
      )
    })
    it('4連結が2ペアある場合も両方に owanimoFlag を立てる', () => {
      const puyos = [
        new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 3,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 4,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 3,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 4,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const renketsuPuyoList = fieldPuyos.searchRenketsu(puyos)
      const result = fieldPuyos.setOwanimoFlag({ puyos, renketsuPuyoList })
      const resultMapped = result.map((p) => ({
        x: p.x,
        y: p.y,
        color: p.color,
        owanimoFlag: p.owanimoFlag,
      }))
      expect(resultMapped).toEqual(
        expect.arrayContaining([
          { x: 1, y: 1, color: 'red', owanimoFlag: true },
          { x: 1, y: 2, color: 'red', owanimoFlag: true },
          { x: 1, y: 3, color: 'red', owanimoFlag: true },
          { x: 1, y: 4, color: 'red', owanimoFlag: true },
          { x: 2, y: 1, color: 'blue', owanimoFlag: true },
          { x: 2, y: 2, color: 'blue', owanimoFlag: true },
          { x: 2, y: 3, color: 'blue', owanimoFlag: true },
          { x: 2, y: 4, color: 'blue', owanimoFlag: true },
        ]),
      )
    })
    it('ぷよが空の場合は空配列を返す', () => {
      const puyos: Puyo[] = []
      const fieldPuyos = new FieldPuyos(puyos)
      const renketsuPuyoList = fieldPuyos.searchRenketsu(puyos)
      const result = fieldPuyos.setOwanimoFlag({ puyos, renketsuPuyoList })
      expect(result).toEqual([])
    })
  })
  describe('オワニモ', () => {
    it('owanimoFlag が true のぷよをフィールドから消す', () => {
      const puyos = [
        new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: true,
        }),
        new Puyo({
          x: 1,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: true,
        }),
        new Puyo({
          x: 1,
          y: 3,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: true,
        }),
        new Puyo({
          x: 1,
          y: 4,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: true,
        }),
        new Puyo({
          x: 2,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const result = fieldPuyos.doOwanimo(puyos)
      const resultMapped = result.map((p) => ({
        x: p.x,
        y: p.y,
        color: p.color,
        owanimoFlag: p.owanimoFlag,
      }))
      expect(resultMapped).toEqual(
        expect.arrayContaining([{ x: 2, y: 1, color: 'blue', owanimoFlag: false }]),
      )
    })
  })
  describe('下に落とす', () => {
    it('落ちるぷよがない場合', () => {
      const puyos = [
        new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 2,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const result = fieldPuyos.dropPuyos({ puyos, xColumn: 6 })
      const resultMapped = result.map((p) => ({
        x: p.x,
        y: p.y,
        color: p.color,
      }))
      expect(resultMapped).toEqual(
        expect.arrayContaining([
          { x: 1, y: 1, color: 'red' },
          { x: 1, y: 2, color: 'red' },
          { x: 2, y: 1, color: 'blue' },
        ]),
      )
    })
    // (1, 1), (1, 2), (1, 4), (1, 5), (1, 8) にぷよがある場合、
    // (1, 1), (1, 2), (1, 3), (1, 4), (1, 5) に落ちることになる
    // チェックのため、それぞれ別の色で検証する
    it('落ちるぷよがある場合', () => {
      const puyos = [
        new Puyo({
          x: 1,
          y: 1,
          xColumn: 6,
          yRow: 13,
          color: 'red',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 2,
          xColumn: 6,
          yRow: 13,
          color: 'blue',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 4,
          xColumn: 6,
          yRow: 13,
          color: 'green',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 5,
          xColumn: 6,
          yRow: 13,
          color: 'yellow',
          owanimoFlag: false,
        }),
        new Puyo({
          x: 1,
          y: 8,
          xColumn: 6,
          yRow: 13,
          color: 'purple',
          owanimoFlag: false,
        }),
      ]
      const fieldPuyos = new FieldPuyos(puyos)
      const result = fieldPuyos.dropPuyos({ puyos, xColumn: 6 })
      const resultMapped = result.map((p) => ({
        x: p.x,
        y: p.y,
        color: p.color,
      }))
      expect(resultMapped).toEqual(
        expect.arrayContaining([
          { x: 1, y: 1, color: 'red' },
          { x: 1, y: 2, color: 'blue' },
          { x: 1, y: 3, color: 'green' },
          { x: 1, y: 4, color: 'yellow' },
          { x: 1, y: 5, color: 'purple' },
        ]),
      )
    })
    it('ぷよが空の場合は空配列を返す', () => {
      const puyos: Puyo[] = []
      const fieldPuyos = new FieldPuyos(puyos)
      const result = fieldPuyos.dropPuyos({ puyos, xColumn: 6 })
      expect(result).toEqual([])
    })
  })
})
