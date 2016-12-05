const assert = require('assert')
const validate = require('validate.js')
const { mLoc, maxOrSkipLocation } = require('../services/max-location')
const { movePanesOutOfTheWay } = require('../services/multi-pane-action')
const {
  findBlockingPanes,
  findDirection,
  findAxis,
  findMovedAmount
} = require('../services/grid-info')

function updateStateLocation (state, x, y) {
  state.x = x
  state.y = y
  state.emit('changeBounds', {x, y, width: state.width, height: state.height, offset: state.grid.offset})
}

module.exports = function locationChanger (state) {
  return ({
    overrideLocation: function overrideLocation ({x, y, width, height} = {}) {
      assert(
        validate.isInteger(x) &&
        validate.isInteger(y) &&
        validate.isInteger(width) &&
        validate.isInteger(height),
        'x, y, width and height need to be integers'
      )
      state.x = x
      state.y = y
      state.width = width
      state.height = height
      state.emit('changeBounds', {x, y, width, height, offset: state.grid.offset})
    },
    changeLocation: function changeLocation (x, y) {
      assert(validate.isInteger(x), `${x} is not numeric`)
      assert(validate.isInteger(y), `${y} is not numeric`)
      assert(state.grid.width >= state.width + x, 'location is outside of grid')
      assert(state.grid.height >= state.height + y, 'location is outside of grid')
      assert(x >= 0, 'location is outside of grid')
      assert(y >= 0, 'location is outside of grid')
      const blockingPanes = findBlockingPanes(state, x, y)
      if (blockingPanes.length === 0) return updateStateLocation(state, x, y)
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
      if (blockingPanes.length === 0) return updateStateLocation(state, x, y)
      const direction = findDirection(state, x, y)
      if (!direction) throw new Error('cannot detect direction')
      const axis = findAxis(state, x, y)
      const maxedLoc = mLoc(state, direction)
      const finalX = axis === 'horizontal' ? maxedLoc.x : state.x
      const finalY = axis === 'vertical' ? maxedLoc.y : state.y
      if (finalX === state.x && finalY === state.y) throw new Error('location blocked by one or more other panes')
      return updateStateLocation(state, finalX, finalY)
    },
    squashIntoLocation: function squashIntoLocation (x, y) {
      assert(validate.isInteger(x), `${x} is not numeric`)
      assert(validate.isInteger(y), `${y} is not numeric`)
      assert(state.grid.width >= state.width + x, 'location is outside of grid')
      assert(state.grid.height >= state.height + y, 'location is outside of grid')
      assert(x >= 0, 'location is outside of grid')
      assert(y >= 0, 'location is outside of grid')
      const direction = findDirection(state, x, y)
      if (!direction) throw new Error('cannot detect direction')
      try {
        const amount = findMovedAmount(state, x, y)
        state.maxLoc(direction)
        if (movePanesOutOfTheWay(state, direction, amount)) return state.changeLocation(x, y)
        throw new Error('no room to squash pane')
      } catch (e) {
        throw new Error('location is blocked by one or more panes')
      }
    },
    maxLoc: function maxLoc (direction) {
      assert(
        direction === 'up' ||
        direction === 'down' ||
        direction === 'left' ||
        direction === 'right',
        `${direction} must be one of up/down/left/right`
      )
      const chosenLocation = mLoc(state, direction)
      if (direction === 'up' || direction === 'down') {
        updateStateLocation(state, state.x, chosenLocation.y)
      } else {
        updateStateLocation(state, chosenLocation.x, state.y)
      }
    },
    maxOrSkipLoc: function maxOrSkipLoc (direction) {
      assert(
        direction === 'up' ||
        direction === 'down' ||
        direction === 'left' ||
        direction === 'right',
        `${direction} must be one of up/down/left/right`
      )
      const chosenLocation = maxOrSkipLocation(state, direction)
      updateStateLocation(state, chosenLocation.x, chosenLocation.y)
    }
  })
}
