const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')

module.exports = function sizeChanger (state, implementation) {
  return ({
    changeSize: function changeSize (width, height) {
      assert(validate.isInteger(width))
      assert(validate.isInteger(height))
      state.grid.representation = occupy(
        state.grid.representation,
        Object.assign({}, state, { width, height }),
        Object.assign({}, state)
      )
      state.width = width
      state.height = height
      if (implementation && typeof implementation.changeSize === 'function') {
        implementation.changeSize(state, width, height)
      }
    }
  })
}
