function hintsForCells (cellsArray, propertyName = 'filled') {
  const numbers = []
  let pending = null

  cellsArray.forEach(cell => {
    if (cell[propertyName] && !pending) {
      pending = 1
    } else if (cell[propertyName] && pending) {
      pending++
    } else if (!cell[propertyName] && pending) {
      numbers.push(pending)
      pending = null
    }
  })
  if (pending) {
    numbers.push(pending)
  }
  if (!numbers.length) {
    numbers.push(0)
  }
  return numbers
}

export { hintsForCells }
