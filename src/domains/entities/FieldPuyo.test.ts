import { describe, it, expect } from 'vitest'
import { FieldPuyos } from './FieldPuyos'
import { Puyo } from './../valueObjects/Puyo'

describe('FieldPuyos', () => {
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
    it('4連結でもそのまま連結している puyo を返す', () => {
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
})
