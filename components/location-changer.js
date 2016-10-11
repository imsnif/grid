const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')
const chooseLocation = require('../services/choose-location')
const mLoc = require('../services/max-location')

function maxOrSkipLocation (state, d) {
  try {
    const { x, y } = mLoc(state, d)
    const skippedLocation = movedInDirection(d, x, y, state)
      ? false
      : chooseLocation.existingPane(state.grid, state, d)
    if (skippedLocation) return skippedLocation
    if (d === 'up' || d === 'down') return {y, x: state.x}
    if (d === 'left' || d === 'right') return {x, y: state.y}
  } catch (e) {
    throw new Error('location blocked')
  }
}

function movedInDirection (d, x, y, state) {
  if ((d === 'up' || d === 'down') && (state.y === y)) return false
  if ((d === 'left' || d === 'right') && (state.x === x)) return false
  return true
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
      occupy(
        state.grid,
        Object.assign({}, state, {x, y})
      )
      state.x = x
      state.y = y
      if (implementation && typeof implementation.changeSize === 'function') {
        implementation.changeLocation(state, x, y)
      }
    },
    maxLoc: function maxLoc (directions) {
      assert(validate.isObject(directions), `${directions} shold be an object`)
      const changed = Object.keys(directions)
        .filter(d => d)
        .filter(d => {
          assert(
            d === 'up' || d === 'down' || d === 'left' || d === 'right',
            `${d} should be one of 'up/down/left/right'`
          )
          const chosenLocation = maxOrSkipLocation(state, d)
          state.x = chosenLocation.x
          state.y = chosenLocation.y
          return true
        })
      if (changed && implementation && typeof implementation.changeBounds === 'function') {
        implementation.changeBounds(state)
      }
    }
  })
}
