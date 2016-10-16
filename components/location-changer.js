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

function pushOrShrinkPane (pane, direction, amount, origLocations) {
  // RECORD ORIG LOCATION
  if (origLocations.filter(o => o.id === pane.id).length > 0) {
    const err = new Error('will not move pane twice')
    err.origLocations = origLocations
    throw err
  }
  origLocations.push({id: pane.id, x: pane.x, y: pane.y, width: pane.width, height: pane.height})
  // MAX SELF DIRECTION TO PUSHER
  const oppositeDirection = direction === 'left' ? 'right'
    : direction === 'right' ? 'left'
    : direction === 'up' ? 'down'
    : direction === 'down' ? 'up' : ''
  pane.maxSize({[oppositeDirection]: true})
  const newLocationForPane = {x: pane.x + amount.x, y: pane.y + amount.y}
  try {
    // ATTEMPT TO PUSH PANE
    pane.changeLocation(newLocationForPane.x, newLocationForPane.y)
    return true
  } catch (e) {
    try {
      // MAX LOCATION TO NEXT PANE
      pane.maxLoc({[direction]: true}, true)
      // ATTEMPT TO MOVE ADJACENT PANES OUT OF THE WAY
      const movedOthers = movePanesOutOfTheWay(pane, direction, amount, origLocations)
      pane.changeLocation(newLocationForPane.x, newLocationForPane.y)
      return movedOthers
    } catch (e) {
      try {
        // ATTEMPT TO SHRINK PANE
        pane.decreaseSizeDirectional(
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
}

function movePanesOutOfTheWay (pane, direction, amount, origLocations = []) {
  const {x, y} = {x: pane.x + amount.x, y: pane.y + amount.y}
  const adjacentPanes = findBlockingPanes(pane, x, y).map(p => pane.grid.getPane(p.id))
  const clearedPanesSuccessfully = adjacentPanes.every(pane => pushOrShrinkPane(pane, direction, amount, origLocations))
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
        // TODO: remove maxedLoc and let the API user decide whether this should be done or not
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
      const origLocation = {
        id: state.id,
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height
      }
      try {
        const direction = findDirection(state, x, y)
        // TODO: get direction from outside
        const amount = direction === 'right' ? {x: x - state.x, y: 0}
          : direction === 'left' ? {x: x - state.x, y: 0}
          : direction === 'up' ? {y: y - state.y, x: 0}
          : direction === 'down' ? {y: y - state.y, x: 0}
          : {x: 0, y: 0}
        state.maxLoc({[direction]: true}, true)
        if (movePanesOutOfTheWay(state, direction, amount)) {
          state.changeLocation(x, y)
        }
      } catch (e) {
        const origLocations = e.origLocations ? e.origLocations.concat(origLocation) : []
        origLocations.forEach(o => {
          const pane = state.grid.getPane(o.id)
          pane.changeLocation(o.x, o.y)
          pane.changeSize(o.width, o.height)
        })
        throw new Error('location is blocked by one or more panes')
      }
    },
    maxLoc: function maxLoc (directions, noSkip) {
      // TODO: noSkip should be the only option
      assert(validate.isObject(directions), `${directions} shold be an object`)
      const changed = Object.keys(directions)
        .filter(d => d)
        .filter(d => {
          assert(
            d === 'up' || d === 'down' || d === 'left' || d === 'right',
            `${d} should be one of 'up/down/left/right'`
          )
          if (noSkip) {
            const chosenLocation = mLoc(state, d)
            if (d === 'up' || d === 'down') {
              state.y = chosenLocation.y
            } else {
              state.x = chosenLocation.x
            }
          } else {
            const chosenLocation = maxOrSkipLocation(state, d)
            state.x = chosenLocation.x
            state.y = chosenLocation.y
          }
        })
      if (changed && implementation && typeof implementation.changeBounds === 'function') {
        implementation.changeBounds(state)
      }
    }
  })
}
