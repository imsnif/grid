const assert = require('assert')
const validate = require('validate.js')

module.exports = function paneAdder (state) {
  return ({
    getPane: function getPane (id) {
      const pane = state.panes.filter(w => w.id === id)[0]
      assert(validate.isDefined(pane))
      return pane
    }
  })
}
