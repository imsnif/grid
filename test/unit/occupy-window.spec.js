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

function isNotOccupied (representation, window) {
  const firstVerticalPoint = window.y
  const firstHorizontalPoint = window.x
  const lastVerticalPoint = window.height + window.y
  const lastHorizontalPoint = window.width + window.x
  for (let y = firstVerticalPoint; y < lastVerticalPoint; y += 1) {
    for (let x = firstHorizontalPoint; x < lastHorizontalPoint; x += 1) {
      if (representation[y][x] === window.id) {
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

test('occupy(representation, window): bad parameters', t => {
  t.plan(2)
  try {
    const initialRepresentation = createRepresentation(1600, 900)
    const window = createWindow(1, 0, 0, 100, 100)
    t.throws(
      () => occupy('a', window),
      Error,
      'occupy with bad representation'
    )
    t.throws(
      () => occupy(initialRepresentation, 'a'),
      Error,
      'occupy with bad window'
    )
  } catch (err) {
    t.fail(err.toString())
    t.end()
  }
})

test('occupy(representation, window, windowPrev): occupy window on representation', t => {
  t.plan(2)
  try {
    const initialRepresentation = createRepresentation(1600, 900)
    const window1 = createWindow(1, 0, 0, 100, 100)
    const window2 = createWindow(1, 200, 200, 100, 100)
    const newRepresentation = occupy(initialRepresentation, window1)
    const finalRepresentation = occupy(newRepresentation, window2, window1)
    t.ok(isOccupied(finalRepresentation, window2), 'window occupied on grid representation')
    t.ok(isNotOccupied(finalRepresentation, window1), 'previous window location not occupied on grid representation')
    // This test is only possible if the first and second location do not have any overlap
  } catch (err) {
    t.fail(err.toString())
    t.end()
  }
})

test('occupy(representation, window, windowPrev): bad parameters', t => {
  t.plan(1)
  try {
    const initialRepresentation = createRepresentation(200, 200)
    const window = createWindow(1, 0, 0, 100, 100)
    t.throws(
      () => occupy(initialRepresentation, window, 'notWindow'),
      Error,
      'occupy with bad prevWindow'
    )
  } catch (err) {
    t.fail(err.toString())
    t.end()
  }
})

test('occupy(representation, window, windowPrev): size exceeds representation', t => {
  t.plan(1)
  try {
    const initialRepresentation = createRepresentation(200, 200)
    const window = createWindow(1, 0, 0, 300, 300)
    t.throws(
      () => occupy(initialRepresentation, window),
      Error,
      'window size exceeds representation'
    )
  } catch (err) {
    t.fail(err.toString())
    t.end()
  }
})

test.skip('occupy(representation, window, windowPrev): space is occupied', t => {
  // TBD
})

test.skip('occupy(representation, window, windowPrev): representation is corrupt', t => {
  // TBD
})
