const assert = require('assert')
const validate = require('validate.js')

module.exports = function paneAdder (state) {
  return ({
    getPane: function getPane (id) {
      const pane = state.panes.find(w => w.id === id)
      assert(validate.isDefined(pane), `${id} does not exist`)
      return pane
    }
  })
}
