import test from 'tape'
import occupy from '../../lib/occupy-window'

function createRepresentation (width, height) {
  return new Array(height)
    .fill([]) // create two dimensional array
    .map(row => new Array(width).fill(0)) // zero fill all cells
}

function createWindow (id, x, y, width, height) {
  return {id, x, y, width, height}
}

function isOccupied (representation, window) {
  const firstVerticalPoint = window.y
  const firstHorizontalPoint = window.x
  const lastVerticalPoint = window.height + window.y
  const lastHorizontalPoint = window.width + window.x
  for (let y = firstVerticalPoint; y < lastVerticalPoint; y += 1) {
    for (let x = firstHorizontalPoint; x < lastHorizontalPoint; x += 1) {
      if (representation[y][x] !== window.id) {
        return false
      }
    }
  }
  return true
}

test('occupy(representation, window): occupy window on representation', t => {
  t.plan(1)
  try {
    const initialRepresentation = createRepresentation(1600, 900)
    const window = createWindow(1, 0, 0, 100, 100)
    const newRepresentation = occupy(initialRepresentation, window)
    t.ok(isOccupied(newRepresentation, window), 'window occupied on grid representation')
  } catch (err) {
    t.fail(err.toString())
    t.end()
  }
})

test.skip('occupy(representation, window): bad parameters', t => {
  // TBD
})

test.skip('occupy(representation, window, windowPrev): occupy window on representation', t => {
  // TBD
})

test.skip('occupy(representation, windowm windowPrev): bad parameters', t => {
  // TBD
})

test.skip('occupy(representation, windowm windowPrev): size exceeds grid', t => {
  // TBD
})

test.skip('occupy(representation, windowm windowPrev): space is occupied', t => {
  // TBD
})

test.skip('occupy(representation, windowm windowPrev): representation is corrupt', t => {
  // TBD
})
