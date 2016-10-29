const occupy = require('./occupy-pane')
const assert = require('assert')

module.exports = {
  findBlockingPanes,
  getOppositeDirection,
  inGrid,
  canShrinkPaneBy,
  findDirection,
  findAxis,
  findMovedAmount,
  getDirection
}

function findBlockingPanes (state, x, y) {
  const adjustedX = x < 0 ? 0 : x > state.grid.width ? state.grid.width : x
  const adjustedY = y < 0 ? 0 : y > state.grid.height ? state.grid.height : y
  try {
    occupy(
      state.grid,
      Object.assign({}, state, {x: adjustedX, y: adjustedY}),
      true
    )
  } catch (e) {
    if (e.message === 'space is occupied') {
      return e.coords
    } else {
      return []
    }
  }
  return []
}

function getOppositeDirection (direction) {
  if (direction === 'left') return 'right'
  if (direction === 'right') return 'left'
  if (direction === 'up') return 'down'
  if (direction === 'down') return 'up'
}

function inGrid (location, pane) {
  return (
    location.x + pane.width <= pane.grid.width &&
    location.y + pane.height <= pane.grid.height &&
    location.x >= 0 &&
    location.y >= 0
  )
}

function canShrinkPaneBy (pane, amount, direction) {
  if ((direction === 'left' || direction === 'right')) return Math.abs(amount.x) < pane.width
  if ((direction === 'up' || direction === 'down')) return Math.abs(amount.y) < pane.height
}

function findAxis (state, x, y) {
  if (state.x === x) return 'vertical'
  if (state.y === y) return 'horizontal'
}

function findDirection (state, x, y) {
  const axis = findAxis(state, x, y)
  if (axis === 'vertical') {
    if (y > state.y) return 'down'
    if (y < state.y) return 'up'
  } else if (axis === 'horizontal') {
    if (x > state.x) return 'right'
    if (x < state.x) return 'left'
  }
}

function findMovedAmount (state, x, y) {
  const direction = findDirection(state, x, y)
  return direction === 'right' ? {x: x - state.x, y: 0}
    : direction === 'left' ? {x: x - state.x, y: 0}
    : direction === 'up' ? {y: y - state.y, x: 0}
    : direction === 'down' ? {y: y - state.y, x: 0}
    : {x: 0, y: 0}
}

function getDirection (directions) {
  return Object.keys(directions)
    .filter(d => d)
    .filter(d => {
      assert(
        d === 'up' || d === 'down' || d === 'left' || d === 'right',
        `${d} should be one of 'up/down/left/right'`
      )
      return d
    })[0]
}
