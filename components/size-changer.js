const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')

module.exports = function sizeChanger (state, implementation) {
  return ({
    changeSize: function changeSize (width, height) {
      assert(validate.isInteger(width))
      assert(validate.isInteger(height))
      if (
        state.grid.width < state.x + width ||
        state.grid.height < state.y + height ||
        width < 0 ||
        height < 0
      ) {
        throw new Error('size exceeds grid')
      }
      occupy(
        state.grid,
        Object.assign({}, state, {width, height})
      )
      state.width = width
      state.height = height
      if (implementation && typeof implementation.changeSize === 'function') {
        implementation.changeSize(state, width, height)
      }
    }
  })
}
