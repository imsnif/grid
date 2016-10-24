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
    }
  })
}
