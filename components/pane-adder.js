const assert = require('assert')
const validate = require('validate.js')
const chooseLocation = require('../services/choose-location')
const PaneWrapper = require('../lib/pane-wrapper')
const occupy = require('../services/occupy-pane')

module.exports = function paneAdder (state) {
  return ({
    add: function add (constructor, opts) {
      assert(validate.isDefined(opts.width), 'width is not defined')
      assert(validate.isDefined(opts.height), 'height is not defined')
      assert(state.panes.every(w => w.id !== opts.id), `${opts.id} already exists`)
      if (
        typeof opts.y === 'undefined' ||
        typeof opts.x === 'undefined'
      ) {
        const chosen = chooseLocation.newPane(state, {
          width: opts.width,
          height: opts.height,
          x: 0,
          y: 0
        }, 'right')
        opts.x = chosen.x
        opts.y = chosen.y
      } else {
        occupy(state, opts)
      }
      const pane = new PaneWrapper(
        constructor,
        Object.assign({}, opts, {grid: state})
      )
      detectPaneClose(pane)
      state.panes.push(pane)
    }
  })
}

function detectPaneClose (pane) {
  if (pane.wrapped && typeof pane.wrapped.on === 'function') {
    pane.wrapped.on('close', () => {
      if (!pane.closed) {
        pane.closed = true
        pane.grid.remove(pane.id)
      }
    })
  }
}
