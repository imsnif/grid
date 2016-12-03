const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')
const max = require('../services/max-size')

module.exports = function sizeChanger (state) {
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
      state.emit('changeBounds', {x: state.x, y: state.y, width, height, offset: state.grid.offset})
    },
    maxSize: function maxSize (direction) {
      assert(
        direction === 'up' ||
        direction === 'down' ||
        direction === 'left' ||
        direction === 'right',
        `${direction} should be one of 'up/down/left/right'`
      )
      if (direction === 'up' || direction === 'down') {
        const { height, y } = max(state, direction)
        state.height = height
        state.y = y
      } else if (direction === 'left' || direction === 'right') {
        const { width, x } = max(state, direction)
        state.width = width
        state.x = x
      }
      state.emit('changeBounds', {
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        offset: state.grid.offset
      })
    }
  })
}
