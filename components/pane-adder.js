const assert = require('assert')
const validate = require('validate.js')
const occupy = require('../services/occupy-pane')
const chooseLocation = require('../services/choose-location')
const PaneWrapper = require('../lib/pane-wrapper')

module.exports = function paneAdder (state) {
  return ({
    add: function add (constructor, opts) {
      opts = opts || {}
      assert(validate.isDefined(opts.width))
      assert(validate.isDefined(opts.height))
      assert(validate.isDefined(opts.id))
      assert(state.panes.every(w => w.Id !== opts.id))
      if (typeof opts.y === 'undefined' || typeof opts.x === 'undefined') {
        const chosen = chooseLocation(state.representation, {
          width: opts.width,
          height: opts.height
        })
        opts.x = chosen.x
        opts.y = chosen.y
      }
      state.representation = occupy(state.representation, opts)
      const pane = new PaneWrapper(constructor, Object.assign({}, opts, {grid: this}))
      this.panes.push(pane)
    }
  })
}
