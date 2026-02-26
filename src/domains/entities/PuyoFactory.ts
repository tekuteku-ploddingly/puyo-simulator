import { type IPuyo, Puyo } from './../valueObjects/Puyo'

interface IPuyoPair {
  jiku: IPuyo
  child: IPuyo
}

export type InitialPattern = 'AA_BB' | 'AB_AB' | 'AA_BC' | 'AB_CC' | 'AB_BC' | 'AA_AB'

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
  private readonly initialPattern?: InitialPattern
  private colorBag: string[] = []
  tsumoPuyo: IPuyoPair
  nextPuyo: IPuyoPair
  next2Puyo: IPuyoPair
  constructor({
    numberOfColors = 4,
    initialPattern,
  }: {
    numberOfColors: number
    initialPattern?: InitialPattern
  }) {
    if (numberOfColors < 3) throw new Error('ぷよの色は3色以上を指定してください')
    if (numberOfColors > 5) throw new Error('ぷよの色は5色以下を指定してください')
    this.count = 1
    this.numberOfColors = numberOfColors
    this.colorVariation = ['#bd2824', '#264dd8', '#ffc932', '#288a3b', '#a949de']
    this.colors = this.getColorRange({ numberOfColors, colorVariation: this.colorVariation })
    this.initialPattern = initialPattern
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
    const { jiku, child } = this.makePairPuyo({
      jikuColor: this.drawColor(),
      childColor: this.drawColor(),
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
    let firstFourColors: string[]

    if (this.initialPattern) {
      firstFourColors = this.generatePatternColors(this.initialPattern)
    } else {
      // 初手とネクストの色（4色）を2〜3色になるまで抽選
      firstFourColors = []
      while (true) {
        firstFourColors = Array.from({ length: 4 }, () => this.drawColor())
        const uniqueCount = new Set(firstFourColors).size
        if (uniqueCount >= 2 && uniqueCount <= 3) break
      }
    }

    // ネクネク（5、6色目）
    const allColors = [
      ...firstFourColors,
      this.drawColor(),
      this.drawColor(),
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

  // パターンに応じた初手+ネクストの4色を生成
  private generatePatternColors(pattern: InitialPattern): [string, string, string, string] {
    const a = this.pickRandomColor()
    const b = this.pickRandomColorExcluding([a])

    switch (pattern) {
      case 'AA_BB':
        return [a, a, b, b]
      case 'AB_AB':
        return [a, b, a, b]
      case 'AA_BC': {
        const c = this.pickRandomColorExcluding([a, b])
        return [a, a, b, c]
      }
      case 'AB_CC': {
        const c = this.pickRandomColorExcluding([a, b])
        return [a, b, c, c]
      }
      case 'AB_BC': {
        const c = this.pickRandomColorExcluding([a, b])
        return [a, b, b, c]
      }
      case 'AA_AB':
        return [a, a, a, b]
    }
  }

  // colors からランダムに1色選ぶ
  private pickRandomColor(): string {
    const index = Math.floor(Math.random() * this.colors.length)
    return this.colors[index]!
  }

  // excludeに含まれない色からランダムに1色選ぶ
  private pickRandomColorExcluding(exclude: string[]): string {
    const candidates = this.colors.filter((c) => !exclude.includes(c))
    if (candidates.length === 0) throw new Error('除外後に選べる色がありません')
    const index = Math.floor(Math.random() * candidates.length)
    return candidates[index]!
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

  // バッグから色を1つ引く（空になったら新しいバッグを作る）
  private drawColor(): string {
    if (this.colorBag.length === 0) {
      this.colorBag = this.createShuffledBag()
    }
    return this.colorBag.pop()!
  }

  // 各色が均等に入ったバッグを作ってシャッフルする
  private createShuffledBag(): string[] {
    // 各色2個ずつ入れる（4色なら8個のバッグ）
    const bag: string[] = []
    for (const color of this.colors) {
      bag.push(color, color)
    }
    // Fisher-Yatesシャッフル
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[bag[i], bag[j]] = [bag[j]!, bag[i]!]
    }
    return bag
  }
}
