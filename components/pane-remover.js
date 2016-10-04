const assert = require('assert')
const validate = require('validate.js')

module.exports = function paneRemover (state) {
  return ({
    remove: function remove (paneId) {
      assert(validate.isDefined(paneId), 'id is not defined')
      assert(state.panes.some(p => p.id === paneId), `${paneId} does not exist`)
      const pane = state.panes.filter(p => p.id === paneId)[0]
      state.panes = state.panes.filter(p => p.id !== pane.id)
      if (!pane.closed) {
        pane.closed = true
        pane.close()
      }
    },
    expel: function expel (paneId) {
      assert(validate.isDefined(paneId), 'id is not defined')
      assert(state.panes.some(p => p.id === paneId), `${paneId} does not exist`)
      const pane = state.panes.filter(p => p.id === paneId)[0]
      state.panes = state.panes.filter(p => p.id !== pane.id)
      pane.wrapped.removeAllListeners('close')
      return pane.wrapped
    }
  })
}
