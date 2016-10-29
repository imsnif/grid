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
    },
    switchPanes: function switchPanes (firstId, secondId) {
      const firstPane = state.getPane(firstId)
      const secondPane = state.getPane(secondId)
      const firstLocation = {
        x: firstPane.x,
        y: firstPane.y,
        height: firstPane.height,
        width: firstPane.width
      }
      const secondLocation = {
        x: secondPane.x,
        y: secondPane.y,
        height: secondPane.height,
        width: secondPane.width
      }
      firstPane.overrideLocation(secondLocation)
      secondPane.overrideLocation(firstLocation)
    }
  })
}
