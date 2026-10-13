import {
  cellsToPixelMap,
  pixelMapToCells,
  createCells,
  resizeCells
} from '../../../src/pixel_pic'
import BINARY_CELLS from '../../../src/cell_data'

function filled (cells) {
  return cells.map(row => row.map(cell => cell.filled ? 1 : 0).join(''))
}

describe('pixelMapToCells', () => {
  it('reads a square pixel map row by row', () => {
    expect(filled(pixelMapToCells('3x3:101101101'))).toEqual(['101', '101', '101'])
  })

  it('reads the width first', () => {
    const cells = pixelMapToCells('4x2:11110000')
    expect(cells.length).toBe(2)
    expect(cells[0].length).toBe(4)
    expect(filled(cells)).toEqual(['1111', '0000'])
  })

  it('throws without a size', () => {
    expect(() => pixelMapToCells('101101101')).toThrow()
  })
})

describe('cellsToPixelMap', () => {
  it('writes the width first', () => {
    const cells = createCells(2, 4, (row) => ({ filled: row === 0 }))
    expect(cellsToPixelMap(cells)).toBe('4x2:11110000')
  })

  it('round trips every built-in puzzle', () => {
    Object.values(BINARY_CELLS).forEach((pixelMap) => {
      expect(cellsToPixelMap(pixelMapToCells(pixelMap))).toBe(pixelMap)
    })
  })
})

describe('resizeCells', () => {
  it('keeps the pixels that still fit', () => {
    const cells = resizeCells(pixelMapToCells('3x3:111111111'), 2, 4)
    expect(filled(cells)).toEqual(['1110', '1110'])
  })
})
