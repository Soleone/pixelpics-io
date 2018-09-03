/*
  These functions convert between the different representations of cells (pixels):

  cells (Vue) <-> binaryString <-> binaryNumber <-> hex (EOS)

  cells: Array of objects with filled attributes set to true where a pixel should be
  binaryString: Shareable format for pixelpics e.g. this represents a small square: 3x3:111101111
  binaryNumber: A specially crafted 128 bit number that represents the pixelpic data as well as dimension definitions
  hex: The binary number converted to hex in EOS format with leading bits reversed
*/

import Decimal from 'decimal.js'

const DIMENSION_DELIMITER = 'x'
const DATA_DELIMITER = ':'

function createCells (rows, columns, cellFunction = newCell) {
  const cells = []
  for (let x = 0; x < rows; x++) {
    const row = []
    for (let y = 0; y < columns; y++) {
      row.push(cellFunction(x, y))
    }
    cells.push(row)
  }
  return cells
}

function resizeCells (cells, targetRowSize, targetColumnSize) {
  const newCells = createCells(targetRowSize, targetColumnSize)

  cells.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (newCells[rowIndex] && newCells[rowIndex][columnIndex]) {
        newCells[rowIndex][columnIndex] = cell
      }
    })
  })
  return newCells
}

function cellsToHex (cells) {
  const binaryString = cellsToBinaryString(cells)
  const binaryNumber = binaryStringToBinaryNumber(binaryString)
  return decimalToHex(binaryNumber)
}

// Input: 2-dimensional Array of cells
// Output: e.g."3x3:101101101"
function cellsToBinaryString (cells) {
  const rowSize = cells.length
  const columnSize = cells[0].length
  const binaryRows = cellsToBinaryRows(cells).map(rows => rows.join('')).join('')
  return `${rowSize}${DIMENSION_DELIMITER}${columnSize}${DATA_DELIMITER}${binaryRows}`
}

// Input: e.g."3x3:101101101"
// Output: 2-dimensional Array of cells
function binaryStringToCells (binaryString) {
  const [sizeInfo, cellData] = binaryString.split(DATA_DELIMITER)
  if (cellData === undefined) throw new Error(`Expected binary string to contain ${DATA_DELIMITER} to denote the board size.`)

  const [columnSize, rowSize] = sizeInfo.split(DIMENSION_DELIMITER)
  if (columnSize === undefined) throw new Error(`Expected binary string to contain ${DIMENSION_DELIMITER} to denote row and column count.`)

  return createCells(rowSize, columnSize, (row, column) => {
    const index = (row * columnSize) + column
    const filledBinary = cellData[index]
    const props = {filled: filledBinary !== '0'}
    return newCell(props)
  })
}

function binaryStringToBinaryNumber (binaryString) {
  const [dimensions, binaryData] = binaryString.split(':')
  const [x, y] = dimensions.split(DIMENSION_DELIMITER)

  const xBinary = (parseInt(x)).toString(2).padStart(5, '0')
  const yBinary = (parseInt(y)).toString(2).padStart(5, '0')

  const binaryNumber = `${binaryData}${yBinary}${xBinary}`.padStart(128, '0')
  return Decimal(`0b${binaryNumber}`)
}

function binaryNumberToBinaryString (binaryNumber) {
  const decimalBinaryNumber = binaryExponentialToBinary(new Decimal(binaryNumber).toBinary(130))
  const binaryNumberAsString = decimalBinaryNumber.padStart(128, 0)
  const x = parseInt(binaryNumberAsString.slice(-5), 2)
  const y = parseInt(binaryNumberAsString.slice(-10, -5), 2)
  const pixelCount = (x * y) || 1
  const binaryDataPadded = binaryNumberAsString.slice(0, -10)
  const binaryData = binaryDataPadded.slice(-pixelCount)
  return `${x}${DIMENSION_DELIMITER}${y}${DATA_DELIMITER}${binaryData}`
}

function decimalToHex (decimal, pad = 32) {
  // TODO: Fix toHex
  const [, hexdata] = new Decimal(decimal).toHex().split('x')
  const hexdataPadded = hexdata.padStart(pad, '0')
  const hexdataReversed = chunk(hexdataPadded, 2).reverse().join('')
  return `0x${hexdataReversed}`
}

function hexToDecimal (hexString) {
  const [, hexdata] = hexString.split('x')
  const hexdataReversed = chunk(hexdata, 2).reverse().join('')
  return new Decimal(`0x${hexdataReversed}`)
}

// private

function chunk (array, chunkSize, cache = []) {
  const tmp = [...array]
  while (tmp.length) cache.push(tmp.splice(0, chunkSize).join(''))
  return cache
}

function newCell (props = {}) {
  return {
    filled: false,
    selected: false,
    marked: false,
    ...props
  }
}

function cellsToBinaryRows (cells) {
  return cells.map(row => {
    return row.map(cell => cell.filled ? 1 : 0)
  })
}

export {
  createCells,
  resizeCells,
  cellsToHex,
  cellsToBinaryString,
  binaryStringToCells,
  binaryStringToBinaryNumber,
  binaryNumberToBinaryString,
  decimalToHex,
  hexToDecimal
}
