import '../spec_helper'
import {
  cellsToEosHex,
  eosHexToCells,
  createCells
} from '../../../src/pixel_pic'

describe('cellsToEosHex', () => {
  it('handles 1x1:0', () => {
    const cells = createCells(1, 1)
    expect(cellsToEosHex(cells)).toBe('0x21000000000000000000000000000000')
  })

  it('handles 1x1:1', () => {
    const cells = createCells(1, 1, () => {
      return { filled: true }
    })
    expect(cellsToEosHex(cells)).toBe('0x21040000000000000000000000000000')
  })

  it('handles 10x10:1', () => {
    const cells = createCells(10, 10, () => {
      return { filled: true }
    })
    expect(cellsToEosHex(cells)).toBe('0x4afdffffffffffffffffffffff3f0000')
  })

  it('handles 10x10:0', () => {
    const cells = createCells(10, 10, () => {
      return { filled: false }
    })
    expect(cellsToEosHex(cells)).toBe('0x4a010000000000000000000000000000')
  })

  it('returns different hex for differently filled cells', () => {
    const cells = createCells(10, 10, () => {
      return { filled: true }
    })
    const differentCells = JSON.parse(JSON.stringify(cells))
    differentCells[0][0] = { filled: false }

    expect(cellsToEosHex(cells)).not.toBe(cellsToEosHex(differentCells))
  })
})

describe('eosHexToCells', () => {
  it('handles 1x1:0', () => {
    const cells = createCells(1, 1)
    expect(eosHexToCells('0x21000000000000000000000000000000')).toEqualFilledCells(cells)
  })

  it('handles 1x1:1', () => {
    const cells = createCells(1, 1, () => {
      return { filled: true }
    })
    expect(eosHexToCells('0x21040000000000000000000000000000')).toEqualFilledCells(cells)
  })

  it('handles 10x10:1', () => {
    const cells = createCells(10, 10, () => {
      return { filled: true }
    })
    expect(eosHexToCells('0x4afdffffffffffffffffffffff3f0000')).toEqualFilledCells(cells)
  })

  it('handles 10x10:0', () => {
    const cells = createCells(10, 10, () => {
      return { filled: false }
    })
    expect(eosHexToCells('0x4a010000000000000000000000000000')).toEqualFilledCells(cells)
  })
})

describe('binaryStringToHex', () => {
  it('handles 0', () => {
    expect('0').fromBinaryStringToHexToBe('00')
  })

  it('handles 1', () => {
    expect('00000001').fromBinaryStringToHexToBe('01')
  })

  it('handles 255', () => {
    expect('11111111').fromBinaryStringToHexToBe('ff')
  })

  it('handles 256', () => {
    expect('0000000100000000').fromBinaryStringToHexToBe('0100')
  })

  it('handles 64 bit max int', () => {
    const expected = '0000000000000000ffffffffffffffff'
    expect('1111111111111111111111111111111111111111111111111111111111111111').fromBinaryStringToHexToBe(expected)
  })

  it('handles 64 bit max int - 1', () => {
    const expected = '0000000000000000fffffffffffffffe'
    expect('1111111111111111111111111111111111111111111111111111111111111110').fromBinaryStringToHexToBe(expected)
  })

  it('handles 128 bit max int', () => {
    const binary = '11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    const expected = 'ffffffffffffffffffffffffffffffff'
    expect(binary).fromBinaryStringToHexToBe(expected)
  })
})

describe('hexToBinaryString', () => {
  it('handles 0', () => {
    expect('00').fromHexToBinaryStringToBe('0')
  })

  it('handles 1', () => {
    expect('00000000000000000000000000000001').fromHexToBinaryStringToBe('1')
  })

  it('handles 255', () => {
    expect('000000000000000000000000000000ff').fromHexToBinaryStringToBe('11111111')
  })

  it('handles 256', () => {
    expect('00000000000000000000000000000100').fromHexToBinaryStringToBe('0000000100000000')
  })

  it('handles max int', () => {
    expect('0000000000000000ffffffffffffffff').fromHexToBinaryStringToBe('1111111111111111111111111111111111111111111111111111111111111111')
  })

  it('handles max int64', () => {
    expect('ffffffffffffffffffffffffffffffff').fromHexToBinaryStringToBe('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111')
  })
})
