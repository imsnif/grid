const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')

module.exports = function locationChanger (state, implementation) {
  return ({
    changeLocation: function changeLocation (x, y) {
      assert(validate.isInteger(x), `${x} is not numeric`)
      assert(validate.isInteger(y), `${y} is not numeric`)
      assert(state.grid.width >= state.width + x, 'location is outside of grid')
      assert(state.grid.height >= state.height + y, 'location is outside of grid')
      assert(x >= 0, 'location is outside of grid')
      assert(y >= 0, 'location is outside of grid')
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
