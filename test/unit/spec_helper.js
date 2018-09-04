import {
  binaryStringToHex,
  hexToBinaryString
} from '../../src/pixel_pic'

function normalizeCells (cells) {
  cells.map((row) => {
    return row.map((cell) => {
      return { filled: cell.filled }
    })
  })
}

expect.extend({
  fromBinaryStringToHexToBe (binaryString, expected) {
    const hex = binaryStringToHex(binaryString.padStart(128, '0'))
    const expectedPadded = expected.padStart(32, '0')
    return {
      message: () => `expected ${expectedPadded} but was ${hex}`,
      pass: hex === expectedPadded
    }
  },
  fromHexToBinaryStringToBe (hex, expected) {
    const binaryString = hexToBinaryString(hex.padStart(32, '0'))
    const expectedPadded = expected.padStart(128, '0')
    return {
      message: () => `expected ${expectedPadded} but was ${binaryString}`,
      pass: binaryString === expectedPadded
    }
  },
  toEqualFilledCells (cells, expectedCells) {
    const normalizedCells = normalizeCells(cells)
    const normalizedExpectedCells = normalizeCells(expectedCells)
    return {
      message: () => `expected ${normalizedExpectedCells} but was ${normalizedCells}`,
      pass: normalizedCells === normalizedExpectedCells
    }
  }
})
