const assert = require('assert')
const validate = require('validate.js')
const { mLoc, maxOrSkipLocation } = require('../services/max-location')
const { movePanesOutOfTheWay } = require('../services/multi-pane-action')
const {
  findBlockingPanes,
  findDirection,
  findAxis,
  findMovedAmount,
  getDirection
} = require('../services/grid-info')

function updateStateLocation (state, x, y, implementation) {
  state.x = x
  state.y = y
  if (implementation && typeof implementation.changeSize === 'function') {
    implementation.changeLocation(state, x, y)
  }
}

module.exports = function locationChanger (state, implementation) {
  return ({
    changeLocation: function changeLocation (x, y) {
      assert(validate.isInteger(x), `${x} is not numeric`)
      assert(validate.isInteger(y), `${y} is not numeric`)
      assert(state.grid.width >= state.width + x, 'location is outside of grid')
      assert(state.grid.height >= state.height + y, 'location is outside of grid')
      assert(x >= 0, 'location is outside of grid')
      assert(y >= 0, 'location is outside of grid')
      const blockingPanes = findBlockingPanes(state, x, y)
      if (blockingPanes.length === 0) return updateStateLocation(state, x, y, implementation)
      throw new Error('location blocked by one or more other panes')
    },
    changeOrMaxLocation: function changeLocation (x, y) {
      assert(validate.isInteger(x), `${x} is not numeric`)
      assert(validate.isInteger(y), `${y} is not numeric`)
      assert(state.grid.width >= state.width + x, 'location is outside of grid')
      assert(state.grid.height >= state.height + y, 'location is outside of grid')
      assert(x >= 0, 'location is outside of grid')
      assert(y >= 0, 'location is outside of grid')
      const blockingPanes = findBlockingPanes(state, x, y)
      if (blockingPanes.length === 0) return updateStateLocation(state, x, y, implementation)
      const direction = findDirection(state, x, y)
      const axis = findAxis(state, x, y)
      const maxedLoc = mLoc(state, direction)
      const finalX = axis === 'horizontal' ? maxedLoc.x : state.x
      const finalY = axis === 'vertical' ? maxedLoc.y : state.y
      if (finalX === state.x && finalY === state.y) throw new Error('location blocked by one or more other panes')
      return updateStateLocation(state, finalX, finalY, implementation)
    },
    squashIntoLocation: function squashIntoLocation (x, y) {
      assert(validate.isInteger(x), `${x} is not numeric`)
      assert(validate.isInteger(y), `${y} is not numeric`)
      assert(state.grid.width >= state.width + x, 'location is outside of grid')
      assert(state.grid.height >= state.height + y, 'location is outside of grid')
      assert(x >= 0, 'location is outside of grid')
      assert(y >= 0, 'location is outside of grid')
      try {
        const direction = findDirection(state, x, y)
        const amount = findMovedAmount(state, x, y)
        state.maxLoc({[direction]: true})
        if (movePanesOutOfTheWay(state, direction, amount)) return state.changeLocation(x, y)
        throw new Error('no room to squash pane')
      } catch (e) {
        throw new Error('location is blocked by one or more panes')
      }
    },
    maxLoc: function maxLoc (directions) {
      assert(validate.isObject(directions), `${directions} shold be an object`)
      const direction = getDirection(directions) // TODO: just accept one direction and forgo the object
      const chosenLocation = mLoc(state, direction)
      if (direction === 'up' || direction === 'down') {
        updateStateLocation(state, state.x, chosenLocation.y)
      } else {
        updateStateLocation(state, chosenLocation.x, state.y)
      }
    },
    maxOrSkipLoc: function maxLoc (directions) {
      assert(validate.isObject(directions), `${directions} shold be an object`)
      const direction = getDirection(directions)
      const chosenLocation = maxOrSkipLocation(state, direction)
      updateStateLocation(state, chosenLocation.x, chosenLocation.y)
    }
  })
}
