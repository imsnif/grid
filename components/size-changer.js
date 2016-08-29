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
            state.height = max[d](state)
          } else if (d === 'left' || d === 'right') {
            state.width = max[d](state)
          } else {
            return false
          }
          return true
        })
      if (changed && implementation && typeof implementation.changeSize === 'function') {
        implementation.changeSize(state, state.width, state.height) // TODO: fix this, no need to pass these explicitly
      }
    }
  })
}
