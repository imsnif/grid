const findNextGaps = require('../services/find-next-gaps')

module.exports = function paneChanger (state) {
  return ({
    maxAllPanes: function maxAllPanes () {
      state.panes
      .forEach(p => {
        const directions = ['left', 'right', 'up', 'down']
        directions.forEach(d => {
          p.maxSize({[d]: true})
        })
      })
    },
    findGaps: function findGaps () {
      return findNextGaps(state, {x: 0, y: 0})
    }
  })
}
