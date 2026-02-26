import { type IPuyo, Puyo } from './../valueObjects/Puyo'

interface IPuyoPair {
  jiku: IPuyo
  child: IPuyo
}

export interface IPuyoFactory {
  count: number
  numberOfColors: number // 色数
  colorVariation: string[] // 使える色
  colors: string[] // 実際に使う色
  tsumoPuyo: IPuyoPair
  nextPuyo: IPuyoPair
  next2Puyo: IPuyoPair
  dropTsumo: () => IPuyoPair
}

// ツモぷよ、ネクスト、ネクネクを作る
export class PuyoFactory implements IPuyoFactory {
  count: number
  readonly numberOfColors: number
  readonly colorVariation
  readonly colors: string[]
  tsumoPuyo: IPuyoPair
  nextPuyo: IPuyoPair
  next2Puyo: IPuyoPair
  constructor({ numberOfColors = 4 }: { numberOfColors: number }) {
    if (numberOfColors < 3) throw new Error('ぷよの色は3色以上を指定してください')
    if (numberOfColors > 5) throw new Error('ぷよの色は5色以下を指定してください')
    this.count = 1
    this.numberOfColors = numberOfColors
    this.colorVariation = ['#bd2824', '#264dd8', '#ffc932', '#288a3b', '#a949de']
    this.colors = this.getColorRange({ numberOfColors, colorVariation: this.colorVariation })
    const { tsumoPuyo, nextPuyo, next2Puyo } = this.initializePuyo()
    this.tsumoPuyo = tsumoPuyo
    this.nextPuyo = nextPuyo
    this.next2Puyo = next2Puyo
  }
  // 今のツモぷよを返して、持ってるぷよを繰り上げて、ネクネクを新しく作る
  dropTsumo(): IPuyoPair {
    this.count = this.count + 1
    const dropPuyo = this.tsumoPuyo
    this.tsumoPuyo = this.nextPuyo
    this.nextPuyo = this.next2Puyo
    this.next2Puyo = this.makePuyo()
    return dropPuyo
  }

  // 4手目以降のぷよを作る
  private makePuyo(): IPuyoPair {
    const pairColors = Array.from({ length: 4 }, () => this.getColor({ colors: this.colors }))
    const c = (i: number): string => {
      const color = pairColors[i]
      if (color === undefined) throw new Error('色の生成に失敗しました')
      return color
    }
    const { jiku, child } = this.makePairPuyo({
      jikuColor: c(0),
      childColor: c(1),
    })
    return { jiku, child }
  }

  private makePairPuyo({
    jikuColor,
    childColor,
  }: {
    jikuColor: string
    childColor: string
  }): IPuyoPair {
    return {
      jiku: new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: jikuColor, owanimoFlag: false }),
      child: new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: childColor, owanimoFlag: false }),
    }
  }

  // 初手〜ネクネクまでのぷよを作る
  private initializePuyo(): { tsumoPuyo: IPuyoPair; nextPuyo: IPuyoPair; next2Puyo: IPuyoPair } {
    // 初手とネクストの色（4色）を2〜3色になるまで抽選
    let firstFourColors: string[] = []
    while (true) {
      firstFourColors = Array.from({ length: 4 }, () => this.getColor({ colors: this.colors }))
      const uniqueCount = new Set(firstFourColors).size
      if (uniqueCount >= 2 && uniqueCount <= 3) break
    }
    // ネクネク（5、6色目）
    const allColors = [
      ...firstFourColors,
      this.getColor({ colors: this.colors }),
      this.getColor({ colors: this.colors }),
    ]
    const c = (i: number): string => {
      const color = allColors[i]
      if (color === undefined) throw new Error('色の生成に失敗しました')
      return color
    }

    const makePair = (jikuColor: string, childColor: string): IPuyoPair => ({
      jiku: new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: jikuColor, owanimoFlag: false }),
      child: new Puyo({ x: 1, y: 1, xColumn: 6, yRow: 3, color: childColor, owanimoFlag: false }),
    })

    return {
      tsumoPuyo: makePair(c(0), c(1)),
      nextPuyo: makePair(c(2), c(3)),
      next2Puyo: makePair(c(4), c(5)),
    }
  }

  // 使う色の候補を選ぶ
  private getColorRange({
    numberOfColors,
    colorVariation,
  }: {
    numberOfColors: number
    colorVariation: string[]
  }) {
    return colorVariation.slice(0, numberOfColors)
  }

  // 色を抽選
  private getColor({ colors }: { colors: string[] }): string {
    const index = Math.floor(Math.random() * colors.length)
    const color = colors[index]
    if (color === undefined) throw new Error('色の抽選に失敗しました')
    return color
  }
}
