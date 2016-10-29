const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')
const { pushOrResizePanesOutOfTheWay } = require('../services/multi-pane-action')

module.exports = function sizeChanger (state, implementation) {
  return ({
    decreaseSizeDirectional: function decreaseSizeDirectional (direction, amount) {
      assert(
        direction === 'right' ||
        direction === 'left' ||
        direction === 'up' || direction === 'down',
        `${direction} must be one of right/left/up/down`
      )
      assert(validate.isInteger(amount), `${amount} must be numeric`)
      assert(
        ((direction === 'left' || direction === 'right') && amount < state.width) ||
        ((direction === 'up' || direction === 'down') && amount < state.height),
        'pane is too small'
      )
      const x = direction === 'left' ? state.x
        : direction === 'right' ? state.x + amount
        : state.x
      const y = direction === 'up' ? state.y
        : direction === 'down' ? state.y + amount
        : state.y
      const width = direction === 'left' || direction === 'right' ? state.width - amount : state.width
      const height = direction === 'up' || direction === 'down' ? state.height - amount : state.height
      occupy(
        state.grid,
        Object.assign({}, state, {x, y, width, height})
      )
      state.x = x
      state.y = y
      state.width = width
      state.height = height
      if (implementation && typeof implementation.changeSize === 'function') {
        implementation.changeBounds(state)
      }
    },
    increaseSizeDirectional: function increaseSizeDirectional (direction, amount) {
      assert(
        direction === 'right' ||
        direction === 'left' ||
        direction === 'up' || direction === 'down',
        `${direction} must be one of right/left/up/down`
      )
      assert(validate.isInteger(amount), `${amount} must be numeric`)
      const x = direction === 'left' ? state.x - amount
        : state.x
      const y = direction === 'up' ? state.y - amount
        : state.y
      const width = direction === 'left' || direction === 'right' ? state.width + amount : state.width
      const height = direction === 'up' || direction === 'down' ? state.height + amount : state.height
      try {
        occupy(
          state.grid,
          Object.assign({}, state, {x, y, width, height})
        )
      } catch (e) {
        return state.maxSize({[direction]: true})
      }
      state.x = x
      state.y = y
      state.width = width
      state.height = height
      if (implementation && typeof implementation.changeSize === 'function') {
        implementation.changeBounds(state)
      }
    },
    increaseAndFillSize: function increaseAndFillSize (direction, amount) {
      assert(
        direction === 'right' ||
        direction === 'left' ||
        direction === 'up' || direction === 'down',
        `${direction} must be one of right/left/up/down`
      )
      assert(validate.isInteger(amount), `${amount} must be numeric`)
      try {
        state.increaseSizeDirectional(direction, amount)
        const amounts =
          direction === 'left' ? {x: parseInt(`-${amount}`), y: 0}
        : direction === 'right' ? {x: amount, y: 0}
        : direction === 'up' ? {x: 0, y: parseInt(`-${amount}`)}
        : direction === 'down' ? {x: 0, y: amount} : {x: 0, y: 0}
        if (pushOrResizePanesOutOfTheWay(state, direction, amounts)) {
          state.increaseSizeDirectional(direction, amount)
        } else {
          throw new Error('no room to increase pane size')
        }
      } catch (e) {
        throw new Error('location is blocked by one or more panes')
      }
    }
  })
}
