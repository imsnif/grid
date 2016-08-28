const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')

module.exports = function locationChanger (state, implementation) {
  return ({
    changeLocation: function changeLocation (x, y) {
      assert(validate.isInteger(x))
      assert(validate.isInteger(y))
      if (
        state.grid.width < state.width + x ||
        state.grid.height < state.height + y ||
        x < 0 ||
        y < 0
      ) {
        throw new Error('location is outside of grid')
      }
      occupy(
        state.grid,
        Object.assign({}, state, {x, y})
      )
      state.x = x
      state.y = y
      if (implementation && typeof implementation.changeSize === 'function') {
        implementation.changeLocation(state, x, y)
      }
    }
  })
}
