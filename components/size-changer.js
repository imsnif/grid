const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')
const max = require('../services/max-size')

module.exports = function sizeChanger (state, implementation) {
  return ({
    changeSize: function changeSize (width, height) {
      assert(validate.isInteger(width), `${width} is not numeric`)
      assert(validate.isInteger(height), `${height} is not numeric`)
      assert(state.grid.width >= state.x + width, 'size exceeds grid')
      assert(state.grid.height >= state.y + height, 'size exceeds grid')
      assert(width >= 0, 'size exceeds grid')
      assert(height >= 0, 'size exceeds grid')
      occupy(
        state.grid,
        Object.assign({}, state, {width, height})
      )
      state.width = width
      state.height = height
      if (implementation && typeof implementation.changeSize === 'function') {
        implementation.changeSize(state, width, height)
      }
    },
    maxSize: function maxSize (directions) {
      assert(validate.isObject(directions), `${directions} shold be an object`)
      const changed = Object.keys(directions)
        .filter(d => d)
        .filter(d => {
          if (d === 'up' || d === 'down') {
            const { height, y } = max(state, d)
            state.height = height
            state.y = y
          } else if (d === 'left' || d === 'right') {
            const { width, x } = max(state, d)
            state.width = width
            state.x = x
          } else {
            throw new Error(`${d} should be one of 'up/down/left/right'`)
          }
          return true
        })
      if (changed && implementation && typeof implementation.changeBounds === 'function') {
        implementation.changeBounds(state)
      }
    },
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
        if (e.message === 'space is occupied' || e.message === 'size exceeds grid') {
          return state.maxSize({[direction]: true})
        } else {
          throw e
        }
      }
      state.x = x
      state.y = y
      state.width = width
      state.height = height
      if (implementation && typeof implementation.changeSize === 'function') {
        implementation.changeBounds(state)
      }
    }
  })
}
