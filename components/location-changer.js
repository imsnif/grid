const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-window')

module.exports = function locationChanger (state, implementation) {
  return ({
    changeLocation: function changeLocation (x, y) {
      assert(validate.isInteger(x))
      assert(validate.isInteger(y))
      state.grid.representation = occupy(
        state.grid.representation,
        Object.assign({}, state, { x, y }),
        state
      )
      state.x = x
      state.y = y
      if (implementation && typeof implementation.changeSize === 'function') {
        implementation.changeLocation(state, x, y)
      }
    }
  })
}
