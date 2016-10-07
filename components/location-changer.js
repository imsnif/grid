const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')
const choosePartialLocation = require('../services/choose-partial-location')
const mLoc = require('../services/max-location')

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
          if (d === 'up' || d === 'down') {
            const { y } = mLoc(state, d)
            // if (state.y === y) throw new Error('location blocked')
            if (state.y === y) {
              try {
                const skippedLocation = choosePartialLocation(
                  state.grid,
                  state,
                  d
                )
                if (skippedLocation) {
                  state.x = skippedLocation.x
                  state.y = skippedLocation.y
                } else {
                  throw new Error(`no room to the ${d}`)
                }
              } catch (e) {
                throw new Error('location blocked')
              }
            } else {
              state.y = y
            }
          } else if (d === 'left' || d === 'right') {
            const { x } = mLoc(state, d)
            if (state.x === x) {
              try {
                const skippedLocation = choosePartialLocation(
                  state.grid,
                  state,
                  d
                )
                if (skippedLocation) {
                  state.x = skippedLocation.x
                  state.y = skippedLocation.y
                } else {
                  throw new Error(`no room to the ${d}`)
                }
              } catch (e) {
                throw new Error('location blocked')
              }
            } else {
              state.x = x
            }
          } else {
            throw new Error(`${d} should be one of 'up/down/left/right'`)
          }
          return true
        })
      if (changed && implementation && typeof implementation.changeBounds === 'function') {
        implementation.changeBounds(state)
      }
    }
  })
}
