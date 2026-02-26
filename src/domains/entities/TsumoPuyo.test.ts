import { describe, it, expect } from 'vitest'
import { TsumoPuyo } from './TsumoPuyo'
import { Puyo } from './../valueObjects/Puyo'

describe('#TsumoPuyo', () => {
  describe('ツモる', () => {
    it('渡されたぷよをツモゾーンに配置する。最初に渡されたぷよが軸ぷよで (3, 2) に配置', () => {
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      tsumoPuyo.tsumo({ puyo: tsumoPuyos })
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 3, y: 2, color: 'red' },
          { x: 3, y: 3, color: 'blue' },
        ]),
      )
    })
  })
  describe('回転', () => {
    it('右回転: 軸ぷよを中心に子ぷよが時計回りに回転する', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      tsumoPuyo.tsumo({ puyo: tsumoPuyos })

      // Act
      tsumoPuyo.rotateRight()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 3, y: 2, color: 'red' },
          { x: 4, y: 2, color: 'blue' },
        ]),
      )
    })
    it('左回転: 軸ぷよを中心に子ぷよが反時計回りに回転する', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      tsumoPuyo.tsumo({ puyo: tsumoPuyos })

      // Act
      tsumoPuyo.rotateLeft()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 3, y: 2, color: 'red' },
          { x: 2, y: 2, color: 'blue' },
        ]),
      )
    })
  })
  describe('水平移動', () => {
    it('左移動: ぷよが左に1マス移動する', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      tsumoPuyo.tsumo({ puyo: tsumoPuyos })

      // Act
      tsumoPuyo.moveLeft()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 2, y: 2, color: 'red' },
          { x: 2, y: 3, color: 'blue' },
        ]),
      )
    })

    it('右移動: ぷよが右に1マス移動する', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      tsumoPuyo.tsumo({ puyo: tsumoPuyos })

      // Act
      tsumoPuyo.moveRight()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 4, y: 2, color: 'red' },
          { x: 4, y: 3, color: 'blue' },
        ]),
      )
    })
  })
  describe('端が絡む処理', () => {
    it('左移動: 左端からはもう移動しない（縦積み）', () => {
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      // 左端に寄せておく
      const config = { jikuX: 1, jikuY: 2, childX: 1, childY: 3 }
      tsumoPuyo.tsumo({ puyo: tsumoPuyos, config })

      // Act
      tsumoPuyo.moveLeft()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 1, y: 2, color: 'red' },
          { x: 1, y: 3, color: 'blue' },
        ]),
      )
    })
    it('左移動: 左端からはもう移動しない（横積み、子が壁側）', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      // 左端に寄せておく
      const config = { jikuX: 2, jikuY: 2, childX: 1, childY: 2 }
      tsumoPuyo.tsumo({ puyo: tsumoPuyos, config })

      // Act
      tsumoPuyo.moveLeft()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 2, y: 2, color: 'red' },
          { x: 1, y: 2, color: 'blue' },
        ]),
      )
    })
    it('左移動: 左端からはもう移動しない（横積み、軸が壁側）', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      // 左端に寄せておく
      const config = { jikuX: 1, jikuY: 2, childX: 2, childY: 2 }
      tsumoPuyo.tsumo({ puyo: tsumoPuyos, config })

      // Act
      tsumoPuyo.moveLeft()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 1, y: 2, color: 'red' },
          { x: 2, y: 2, color: 'blue' },
        ]),
      )
    })
    it('右移動: 右端からはもう移動しない（縦積み）', () => {
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      // 右端に寄せておく
      const config = { jikuX: 6, jikuY: 2, childX: 6, childY: 3 }
      tsumoPuyo.tsumo({ puyo: tsumoPuyos, config })

      // Act
      tsumoPuyo.moveRight()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 6, y: 2, color: 'red' },
          { x: 6, y: 3, color: 'blue' },
        ]),
      )
    })
    it('右移動: 右端からはもう移動しない（横積み、子が壁側）', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      // 右端に寄せておく
      const config = { jikuX: 5, jikuY: 2, childX: 6, childY: 2 }
      tsumoPuyo.tsumo({ puyo: tsumoPuyos, config })

      // Act
      tsumoPuyo.moveRight()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 5, y: 2, color: 'red' },
          { x: 6, y: 2, color: 'blue' },
        ]),
      )
    })
    it('右移動: 右端からはもう移動しない（横積み、軸が壁側）', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      // 右端に寄せておく
      const config = { jikuX: 6, jikuY: 2, childX: 5, childY: 2 }
      tsumoPuyo.tsumo({ puyo: tsumoPuyos, config })

      // Act
      tsumoPuyo.moveRight()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 6, y: 2, color: 'red' },
          { x: 5, y: 2, color: 'blue' },
        ]),
      )
    })
    it('左の壁蹴り: 上が子、左端で左回転すると、壁から離れるように壁蹴りする', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      // 左端に寄せておく
      const config = { jikuX: 1, jikuY: 2, childX: 1, childY: 3 }
      tsumoPuyo.tsumo({ puyo: tsumoPuyos, config })

      // Act
      tsumoPuyo.rotateLeft()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 2, y: 2, color: 'red' },
          { x: 1, y: 2, color: 'blue' },
        ]),
      )
    })
    it('壁蹴り: 上が軸、左端で右回転すると、壁から離れるように壁蹴りする', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      // 左端に寄せておく
      const config = { jikuX: 1, jikuY: 2, childX: 1, childY: 1 }
      tsumoPuyo.tsumo({ puyo: tsumoPuyos, config })

      // Act
      tsumoPuyo.rotateRight()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 2, y: 2, color: 'red' },
          { x: 1, y: 2, color: 'blue' },
        ]),
      )
    })
    it('壁蹴り: 上が子、右端で右回転すると、壁から離れるように壁蹴りする', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      // 右端に寄せておく
      const config = { jikuX: 6, jikuY: 2, childX: 6, childY: 3 }
      tsumoPuyo.tsumo({ puyo: tsumoPuyos, config })

      // Act
      tsumoPuyo.rotateRight()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 5, y: 2, color: 'red' },
          { x: 6, y: 2, color: 'blue' },
        ]),
      )
    })
    it('壁蹴り: 上が軸、右端で左回転すると、壁から離れるように壁蹴りする', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      // 右端に寄せておく
      const config = { jikuX: 6, jikuY: 2, childX: 6, childY: 1 }
      tsumoPuyo.tsumo({ puyo: tsumoPuyos, config })

      // Act
      tsumoPuyo.rotateLeft()

      // Assert
      const result = tsumoPuyo.puyos.map((p) => ({ x: p.x, y: p.y, color: p.color }))
      expect(result).toEqual(
        expect.arrayContaining([
          { x: 5, y: 2, color: 'red' },
          { x: 6, y: 2, color: 'blue' },
        ]),
      )
    })
  })
  describe('ツモぷよをdrop用ぷよに変換', () => {
    it('初期状態: 上が子、下が軸', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      tsumoPuyo.tsumo({ puyo: tsumoPuyos })

      // Act
      const { jikuPuyo, childPuyo } = tsumoPuyo.getDropPuyo({ fieldYRow: 13 })

      // Assert
      const resultJiku = { x: jikuPuyo.x, y: jikuPuyo.y, color: jikuPuyo.color }
      const resultChild = { x: childPuyo.x, y: childPuyo.y, color: childPuyo.color }
      expect(resultJiku).toEqual({
        x: 3,
        y: 12,
        color: 'red',
      })
      expect(resultChild).toEqual({
        x: 3,
        y: 13,
        color: 'blue',
      })
    })
    it('1/4回転: 軸と子が横並び', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      tsumoPuyo.tsumo({ puyo: tsumoPuyos })
      tsumoPuyo.rotateLeft()

      // Act
      const { jikuPuyo, childPuyo } = tsumoPuyo.getDropPuyo({ fieldYRow: 13 })

      // Assert
      const resultJiku = { x: jikuPuyo.x, y: jikuPuyo.y, color: jikuPuyo.color }
      const resultChild = { x: childPuyo.x, y: childPuyo.y, color: childPuyo.color }
      expect(resultJiku).toEqual({
        x: 3,
        y: 13,
        color: 'red',
      })
      expect(resultChild).toEqual({
        x: 2,
        y: 13,
        color: 'blue',
      })
    })
    it('半回転: 軸と子が横並び', () => {
      // Arrange
      const tsumoPuyo = new TsumoPuyo({ xColumn: 6, yRow: 3 })
      const tsumoPuyos = [
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'red', owanimoFlag: false }),
        new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: 'blue', owanimoFlag: false }),
      ]
      tsumoPuyo.tsumo({ puyo: tsumoPuyos })
      tsumoPuyo.rotateLeft()
      tsumoPuyo.rotateLeft()

      // Act
      const { jikuPuyo, childPuyo } = tsumoPuyo.getDropPuyo({ fieldYRow: 13 })

      // Assert
      const resultJiku = { x: jikuPuyo.x, y: jikuPuyo.y, color: jikuPuyo.color }
      const resultChild = { x: childPuyo.x, y: childPuyo.y, color: childPuyo.color }
      expect(resultJiku).toEqual({
        x: 3,
        y: 13,
        color: 'red',
      })
      expect(resultChild).toEqual({
        x: 3,
        y: 12,
        color: 'blue',
      })
    })
  })
})
