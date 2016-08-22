module.exports = function checkDiagonally (representation, pane) {
  if (pane.width >= pane.height) {
    widthDiagonalIteration(representation, pane)
  } else {
    heightDiagonalIteration(representation, pane)
  }
}

function widthDiagonalIteration (representation, pane) {
  let x = pane.x
  for (let y = pane.y; y <= pane.height; y += 1) {
    checkBlocked(representation, y, x)
    x = x === pane.x + pane.width ? pane.x : x + 1
  }
}

function heightDiagonalIteration (representation, pane) {
  let y = pane.y
  for (let x = pane.x; x <= pane.width; x += 1) {
    checkBlocked(representation, y, x)
    y = y === pane.y + pane.height ? pane.y : y + 1
  }
}

function checkBlocked (representation, y, x) {
  if (
    !Array.isArray(representation[y]) ||
    typeof representation[y][x] === 'undefined' ||
    representation[y][x] !== 0
  ) {
    const err = new Error('blocked')
    err.coords = {x, y}
    throw err
  }
}
