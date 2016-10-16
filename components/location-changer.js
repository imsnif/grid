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
  const adjustedX = x < 0 ? 0 : x > state.grid.width ? state.grid.width : x
  const adjustedY = y < 0 ? 0 : y > state.grid.height ? state.grid.height : y
  try {
    occupy(
      state.grid,
      Object.assign({}, state, {x: adjustedX, y: adjustedY}),
      true // TODO: remove this
    )
  } catch (e) {
    if (e.message === 'space is occupied') {
      return e.coords
    } else if (e.message === 'size exceeds grid') {
      // return [state]
      return []
    } else {
      return []
    }
  }
  return []
}

function paneIsOnEdge (pane, direction) {
  if (direction === 'right' && pane.x + pane.width === pane.grid.width) return true
  if (direction === 'left' && pane.x === 0) return true
  if (direction === 'up' && pane.y === 0) return true
  if (direction === 'down' && pane.y + pane.height === pane.grid.height) return true
  return false
}

function pushOrShrinkPane (pane, direction, amount, origLocations) {
  if (origLocations.filter(o => o.id === pane.id).length > 0) return false
  const origLocationOfPane = {id: pane.id, x: pane.x, y: pane.y, width: pane.width, height: pane.height}
  // MAX SELF DIRECTION TO PUSHER
  const oppositeDirection = direction === 'left' ? 'right'
    : direction === 'right' ? 'left'
    : direction === 'up' ? 'down'
    : direction === 'down' ? 'up' : ''
  pane.maxSize({[oppositeDirection]: true})
  const newLocationForPane =
    direction === 'left' ? {x: pane.x + amount.x, y: pane.y}
    : direction === 'right' ? {x: pane.x + amount.x, y: pane.y}
    : direction === 'up' ? {x: pane.x, y: pane.y + amount.y}
    : direction === 'down' ? {x: pane.x, y: pane.y + amount.y} : {x: pane.x, y: pane.y}
  // ATTEMPT TO PUSH PANE
  const blockingPanes = findBlockingPanes(pane, newLocationForPane.x, newLocationForPane.y)
  if (
    (blockingPanes.length === 0 && !paneIsOnEdge(pane, direction)) &&
    ((newLocationForPane.x + pane.width <= pane.grid.width) && ((newLocationForPane.y + pane.height <= pane.grid.height)))
  ) {
    pane.changeLocation(newLocationForPane.x, newLocationForPane.y)
    origLocations.push(origLocationOfPane)
    return true
  }
  if (blockingPanes.length > 0) {
    // MAX LOCATION TO NEXT PANE
    pane.maxLoc({[direction]: true}, true)
    // ATTEMPT TO MOVE ADJACENT PANES OUT OF THE WAY
    const [ movedOthers ] = movePanesOutOfTheWay(pane, direction, amount, origLocations)
    if (movedOthers) {
      pane.changeLocation(newLocationForPane.x, newLocationForPane.y)
      origLocations.push(origLocationOfPane)
      return true
    }
  }
  // ATTEMPT TO SHRINK PANE
  if (
    ((direction === 'left' || direction === 'right') && Math.abs(amount.x) < pane.width) ||
    ((direction === 'up' || direction === 'down') && Math.abs(amount.y) < pane.height)
  ) {
    pane.decreaseSizeDirectional(
      direction,
      direction === 'left' || direction === 'right' ? Math.abs(amount.x) : Math.abs(amount.y)
    )
    origLocations.push(origLocationOfPane)
    return true
  }
  return false
}

function movePanesOutOfTheWay (pane, direction, amount, origLocations = []) {
  const {x, y} = {x: pane.x + amount.x, y: pane.y + amount.y}
  const adjacentPanes = findBlockingPanes(pane, x, y).map(p => pane.grid.getPane(p.id))
  const clearedPanesSuccessfully = adjacentPanes.every(pane => pushOrShrinkPane(pane, direction, amount, origLocations))
  if (!clearedPanesSuccessfully) {
    return [ false, origLocations ]
  } else {
    return [ true, origLocations ]
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
      try {
        const direction = findDirection(state, x, y)
        // TODO: get direction from outside
        const amount = direction === 'right' ? {x: x - state.x, y: 0}
          : direction === 'left' ? {x: x - state.x, y: 0}
          : direction === 'up' ? {y: y - state.y, x: 0}
          : direction === 'down' ? {y: y - state.y, x: 0}
          : {x: 0, y: 0}
        state.maxLoc({[direction]: true}, true)
        const [ movedOthers, origLocations ] = movePanesOutOfTheWay(state, direction, amount)
        if (movedOthers) {
          state.changeLocation(x, y)
        } else {
          origLocations.forEach(o => {
            const origLocationPane = state.grid.getPane(o.id)
            origLocationPane.changeLocation(o.x, o.y)
            origLocationPane.changeSize(o.width, o.height)
          })
          throw new Error('no room to squash pane')
        }
      } catch (e) {
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
