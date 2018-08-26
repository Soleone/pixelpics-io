import Decimal from 'decimal.js'

const DIMENSION_DELIMITER = 'x'
const DATA_DELIMITER = ':'

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

// Input: 2-dimensional Array of cells
// Output: e.g."3x3:101101101"
function cellsToBinaryString (cells) {
  const rowSize = cells.length
  const columnSize = cells[0].length
  const binaryRows = cellsToBinaryRows(cells).map(rows => rows.join('')).join('')
  return `${rowSize}${DIMENSION_DELIMITER}${columnSize}${DATA_DELIMITER}${binaryRows}`
}

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

function decimalToHex (decimal, pad = 32) {
  const [, hexdata] = new Decimal(decimal).toHex().split('x')
  return `0x${hexdata.padStart(pad, '0')}`
}

// function binaryStringToBinaryNumber (binaryString) {
//   const [dimensions, binaryData] = binaryString.split(':')
//   const [x, y] = dimensions.split('x')
//
//   const xBinary = (parseInt(x)).toString(2).padStart(5, '0')
//   const yBinary = (parseInt(y)).toString(2).padStart(5, '0')
//
//   console.log(x)
//   console.log(xBinary)
//   console.log(y)
//   console.log(yBinary)
//   const binaryNumber = `${binaryData}${yBinary}${xBinary}`.padStart(128, '0')
//   console.log(`Binary number: ${binaryNumber}`)
//   const number = parseInt(binaryNumber, 2)
//   console.log(`Number: ${number}`)
//   return number
// }
//
// function binaryNumberToBinaryString (binaryNumber) {
//   let binaryString = ''
//   const binaryNumberAsString = ((binaryNumber).toString(2))
//   console.log(`binaryNumberAsString: ${binaryNumberAsString}`)
//   const x = parseInt(binaryNumberAsString.slice(-5), 2)
//   const y = parseInt(binaryNumberAsString.slice(-10, -5), 2)
//   const binaryData = binaryNumberAsString.slice(0, -10)
//
//   binaryString = `${x}x${y}:${binaryData}`
//
//   return binaryString
// }

// private

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

export { binaryStringToCells, cellsToBinaryString, decimalToHex, createCells, resizeCells }
