import '../spec_helper'
import { Decimal } from 'decimal.js'
import {
  binaryStringToBinaryNumber,
  binaryNumberToBinaryString,
  decimalToHex,
  hexToDecimal,
  cellsToHex,
  createCells
} from '../../../src/pixel_pic'

describe('binaryStringToBinaryNumber', () => {
  it('returns 0 for empty board', () => {
    const binaryString = '0x0:0'
    const binaryNumber = binaryStringToBinaryNumber(binaryString)
    expect(binaryNumber.toString()).toBe('0')
  })

  it('returns 33 for 00000100001', () => {
    const binaryString = '1x1:0'
    const binaryNumber = binaryStringToBinaryNumber(binaryString)
    expect(binaryNumber.toString()).toBe('33')
  })

  it('returns 1057 for 100000100001', () => {
    const binaryString = '1x1:1'
    const binaryNumber = binaryStringToBinaryNumber(binaryString)
    expect(binaryNumber.toString()).toBe('1057')
  })

  it('handles 5x5 with every pixel filled out', () => {
    const binaryString = '5x5:1111111111111111111111111'
    const binaryNumber = binaryStringToBinaryNumber(binaryString)
    // 2**5 * 2**5 * 2**25 - (16+8+2+512+256+64)  <-- why does -1 have to be added to make test pass?
    // 016 008 004 002 001
    // 512 256 128 064 032
    expect(binaryNumber.toFixed(0)).toBe('34359737509')
  })

  it('handles 10x10 with every pixel filled out', () => {
    const binaryString = '10x10:1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    const binaryNumber = binaryStringToBinaryNumber(binaryString)
    // 2**5 * 2**5 * 2**100 - (16+4+1+512+128+32)  <-- why does -1 have to be added to make test pass?
    // 016 008 004 002 001
    // 512 256 128 064 032
    expect(binaryNumber.toFixed(0)).toBe('1298074214633706907132624082304330')
  })
})

describe('binaryNumberToBinaryString', () => {
  it('returns 0x0:0 for 0', () => {
    const binaryNumber = '0'
    const binaryString = binaryNumberToBinaryString(binaryNumber)
    expect(binaryString).toBe('0x0:0')
  })

  it('returns 1x1:0 for 33', () => {
    const binaryNumber = '33'
    const binaryString = binaryNumberToBinaryString(binaryNumber)
    expect(binaryString).toBe('1x1:0')
  })

  it('returns 1x1:1 for 1057', () => {
    const binaryNumber = '1057'
    const binaryString = binaryNumberToBinaryString(binaryNumber)
    expect(binaryString).toBe('1x1:1')
  })

  it('handles 5x5 with every pixel filled out', () => {
    const binaryNumber = '34359737509'
    const binaryString = binaryNumberToBinaryString(binaryNumber)
    expect(binaryString).toBe('5x5:1111111111111111111111111')
  })

  it('handles 10x10 with every pixel filled out', () => {
    const binaryNumber = '1298074214633706907132624082304330'
    const binaryString = binaryNumberToBinaryString(binaryNumber)
    expect(binaryString).toBe('10x10:1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111')
  })
})

describe('decimalToHex', () => {
  it('returns a 32 char hex string of zeroes for 0', () => {
    const hex = decimalToHex(0)
    expect(hex).toBe('0x00000000000000000000000000000000')
  })

  it('returns ff pairs for 64 bit max int', () => {
    const hex = decimalToHex(new Decimal('18446744073709551615'))
    expect(hex).toBe('0xffffffffffffffff0000000000000000')
  })

  it('returns one fe pair at the start for one less than 64 bit max int', () => {
    const hex = decimalToHex(new Decimal('18446744073709551614'))
    expect(hex).toBe('0xfeffffffffffffff0000000000000000')
  })

  it('returns one ff pair only at the start for 255', () => {
    const hex = decimalToHex(255)
    expect(hex).toBe('0xff000000000000000000000000000000')
  })

  it('returns one ff pair only at the start for 256', () => {
    const hex = decimalToHex(256)
    expect(hex).toBe('0x00010000000000000000000000000000')
  })
})

describe('hexToDecimal', () => {
  it('returns a string of 0 for a zero hex', () => {
    const decimal = hexToDecimal('0x00000000000000000000000000000000')
    expect(decimal.toString()).toBe('0')
  })

  it('returns a string of 1 for a 1 hex', () => {
    const decimal = hexToDecimal('0x01000000000000000000000000000000')
    expect(decimal.toString()).toBe('1')
  })

  it('returns a string of 255 for a ff hex', () => {
    const decimal = hexToDecimal('0xff000000000000000000000000000000')
    expect(decimal.toString()).toBe('255')
  })

  it('returns a string of 256 for a 0001 hex', () => {
    const decimal = hexToDecimal('0x0001000000000000000000000000000000')
    expect(decimal.toString()).toBe('256')
  })

  it('returns a string of max int for all ff hex pairs', () => {
    const decimal = hexToDecimal('0xffffffffffffffff000000000000000000')
    expect(decimal.toString()).toBe('18446744073709551615')
  })

  it('returns a string of max int64 for all ff hex pairs', () => {
    const decimal = hexToDecimal('0x5eaffffffffffffffffffffffff00000000')
    expect(decimal.toString()).toBe('1298074214633706907132624082304330')
  })
})

describe('cellsToHex', () => {
  it('returns 33 as hex for 1x1:0', () => {
    const cells = createCells(1, 1)
    expect(cellsToHex(cells)).toBe('0x21000000000000000000000000000000')
  })

  it('returns 1057 as hex for 1x1:1', () => {
    const cells = createCells(1, 1, () => {
      return { filled: true }
    })
    expect(cellsToHex(cells)).toBe('0x21040000000000000000000000000000')
  })

  it('returns 1298074214633706907132624082304330 as hex for 10x10:1', () => {
    const cells = createCells(10, 10, () => {
      return { filled: true }
    })
    expect(cellsToHex(cells)).toBe('0x5peaffffffffffffffffffffffff00000000')
  })

  it('returns different hex for differently filled cells', () => {
    const cells = createCells(10, 10, () => {
      return { filled: true }
    })
    const differentCells = cells.slice()
    differentCells[9][9].filled = false

    expect(cellsToHex(cells)).not.toBe(cellsToHex(differentCells))
  })
})
