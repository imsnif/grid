const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')
const chooseLocation = require('../services/choose-location')
const mLoc = require('../services/max-location')

function maxOrSkipLocation (state, d) {
  // TODO: move this logic outside this module, grid should not bemakig this decision
  try {
    const { x, y } = mLoc(state, d)
    const skippedLocation = movedInDirection(d, x, y, state)
      ? false
      : chooseLocation(state.grid, state, d)
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

function findBlockingPanes (state, x, y) {
  try {
    occupy(
      state.grid,
      Object.assign({}, state, {x, y}),
      true // TODO: remove this
    )
  } catch (e) {
    if (e.message === 'space is occupied') {
      return e.coords
    } else if (e.message === 'size exceeds grid') {
      return [state]
    } else {
      return []
    }
  }
  return []
}

function movePanesOutOfTheWay (implementation, state, x, y, origLocations = []) {
  // MOVE PANE MAX TO NEXT PANE
  const direction = findDirection(state, x, y)
  const axis = findAxis(state, x, y)
  const maxedLoc = mLoc(state, direction)
  state.x = axis === 'horizontal' ? maxedLoc.x : state.x
  state.y = axis === 'vertical' ? maxedLoc.y : state.y
  if (implementation && typeof implementation.changeSize === 'function') {
    implementation.changeLocation(state, state.x, state.y)
  }
  const amount = direction === 'right' ? {x: x - state.x, y: 0}
    : direction === 'left' ? {x: x - state.x, y: 0}
    : direction === 'up' ? {y: y - state.y, x: 0}
    : direction === 'down' ? {y: y - state.y, x: 0}
    : {x: 0, y: 0}
  const adjacentPanes = findBlockingPanes(state, x, y)
  const clearedPanesSuccessfully = adjacentPanes.every(pane => {
    // RECORD ORIG LOCATION
    if (origLocations.filter(o => o.id === pane.id).length > 0) {
      if (pane.x > state.x + amount.x || pane.y > state.y + amount.y) return true
      const err = new Error('will not move pane twice')
      err.origLocations = origLocations
      throw err
    }
    origLocations.push({id: pane.id, x: pane.x, y: pane.y, width: pane.width, height: pane.height})
    const paneState = state.grid.getPane(pane.id)
    // MAX SELF DIRECTION TO PUSHER
    const oppositeDirection = direction === 'left' ? 'right'
      : direction === 'right' ? 'left'
      : direction === 'up' ? 'down'
      : direction === 'down' ? 'up' : ''
    paneState.maxSize({[oppositeDirection]: true})
    const newLocationForPane = {x: pane.x + amount.x, y: pane.y + amount.y}
    try {
      // ATTEMPT TO PUSH PANE
      state.grid.getPane(pane.id).changeLocation(newLocationForPane.x, newLocationForPane.y)
      return true
    } catch (e) {
      try {
        // ATTEMPT TO MOVE ADJACENT PANES OUT OF THE WAY
        const [ nextX, nextY ] = direction === 'left' ? [ x - pane.width, pane.y ]
          : direction === 'right' ? [ state.width + x, pane.y ]
          : direction === 'up' ? [ pane.x, y - pane.height ]
          : direction === 'down' ? [ pane.x, state.height + y ] : [ x, y ]
        const movedOthers = movePanesOutOfTheWay(implementation, paneState, nextX, nextY, origLocations)
        state.grid.getPane(pane.id).changeLocation(newLocationForPane.x, newLocationForPane.y)
        return movedOthers
      } catch (e) {
        try {
          // ATTEMPT TO SHRINK PANE
          if (
            // TODO: move ths logic to decrease pane directional
            ((direction === 'left' || direction === 'right') && Math.abs(amount.x) >= pane.width) ||
            ((direction === 'up' || direction === 'down') && Math.abs(amount.y) >= pane.height)
          ) {
            throw new Error('pane is too small')
          }
          state.grid.getPane(pane.id).decreaseSizeDirectional(
            direction,
            direction === 'left' || direction === 'right' ? Math.abs(amount.x) : Math.abs(amount.y)
          )
          return true
        } catch (e) {
          e.origLocations = origLocations
          throw e
        }
      }
    }
  })
  return clearedPanesSuccessfully
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
        if (movePanesOutOfTheWay(implementation, state, x, y)) {
          state.changeLocation(x, y)
        }
      } catch (e) {
        const origLocations = e.origLocations || []
        origLocations.forEach(o => {
          const pane = state.grid.getPane(o.id)
          pane.changeLocation(o.x, o.y)
          pane.changeSize(o.width, o.height)
        })
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
