/*
  These functions convert between the different representations of cells (pixels):

  cells (Vue) <-> pixelMap

  cells: Array of objects with filled attributes set to true where a pixel should be
  pixelMap: Shareable format for pixelpics, e.g. this represents a small square: 3x3:111101111
*/

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

// Input: 2-dimensional Array of cells
// Output: e.g."3x3:101101101" (columns x rows)
function cellsToPixelMap (cells) {
  const rowSize = cells.length
  const columnSize = cells[0].length
  const binaryRows = cellsToBinaryRows(cells).map(rows => rows.join('')).join('')
  return `${columnSize}${DIMENSION_DELIMITER}${rowSize}${DATA_DELIMITER}${binaryRows}`
}

// Input: e.g."3x3:101101101"
// Output: 2-dimensional Array of cells
function pixelMapToCells (binaryString) {
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

export {
  createCells,
  resizeCells,
  cellsToPixelMap,
  pixelMapToCells
}
