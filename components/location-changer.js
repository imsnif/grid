const assert = require('assert')
const validate = require('validate.js')
const { mLoc, maxOrSkipLocation } = require('../services/max-location')
const { movePanesOutOfTheWay } = require('../services/multi-pane-action')
const { findBlockingPanes, findDirection, findAxis } = require('../services/grid-info')

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
      if (blockingPanes.length === 0) {
        state.x = x
        state.y = y
        if (implementation && typeof implementation.changeSize === 'function') {
          implementation.changeLocation(state, x, y)
        }
      } else {
        throw new Error('location blocked by one or more other panes')
      }
    },
    changeOrMaxLocation: function changeLocation (x, y) {
      assert(validate.isInteger(x), `${x} is not numeric`)
      assert(validate.isInteger(y), `${y} is not numeric`)
      assert(state.grid.width >= state.width + x, 'location is outside of grid')
      assert(state.grid.height >= state.height + y, 'location is outside of grid')
      assert(x >= 0, 'location is outside of grid')
      assert(y >= 0, 'location is outside of grid')
      const blockingPanes = findBlockingPanes(state, x, y)
      if (blockingPanes.length === 0) {
        state.x = x
        state.y = y
        if (implementation && typeof implementation.changeSize === 'function') {
          implementation.changeLocation(state, x, y)
        }
      } else {
        const direction = findDirection(state, x, y)
        const axis = findAxis(state, x, y)
        const maxedLoc = mLoc(state, direction)
        const finalX = axis === 'horizontal' ? maxedLoc.x : state.x
        const finalY = axis === 'vertical' ? maxedLoc.y : state.y
        if (finalX === state.x && finalY === state.y) throw new Error('location blocked by one or more other panes')
        state.x = finalX
        state.y = finalY
        if (implementation && typeof implementation.changeSize === 'function') {
          implementation.changeLocation(state, finalX, finalY)
        }
      }
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
        // TODO: get direction from outside
        const amount = direction === 'right' ? {x: x - state.x, y: 0}
          : direction === 'left' ? {x: x - state.x, y: 0}
          : direction === 'up' ? {y: y - state.y, x: 0}
          : direction === 'down' ? {y: y - state.y, x: 0}
          : {x: 0, y: 0}
        state.maxLoc({[direction]: true})
        if (movePanesOutOfTheWay(state, direction, amount)) {
          state.changeLocation(x, y)
        } else {
          throw new Error('no room to squash pane')
        }
      } catch (e) {
        throw new Error('location is blocked by one or more panes')
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
          const chosenLocation = mLoc(state, d)
          if (d === 'up' || d === 'down') {
            state.y = chosenLocation.y
          } else {
            state.x = chosenLocation.x
          }
        })
      if (changed && implementation && typeof implementation.changeBounds === 'function') {
        implementation.changeBounds(state)
      }
    },
    maxOrSkipLoc: function maxLoc (directions) {
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
        })
      if (changed && implementation && typeof implementation.changeBounds === 'function') {
        implementation.changeBounds(state)
      }
    }
  })
}
