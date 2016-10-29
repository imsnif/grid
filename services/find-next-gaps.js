const occupy = require('../services/occupy-pane')
const max = require('../services/max-size')

function maxSizeAtPoint (grid, coords, gaps, blockers) {
  const panesAndExistingGaps = grid.panes.concat(gaps)
  const fakeGrid = Object.assign({}, grid, {panes: panesAndExistingGaps})
  occupy(fakeGrid, Object.assign({}, coords, {width: 1, height: 1}))
  const {x, width} = max({x: coords.x, y: coords.y, width: 1, height: 1, grid: fakeGrid}, 'right')
  const {y, height} = max({width, x, y: coords.y, height: 1, grid: fakeGrid}, 'down')
  return {x, y, width, height}
}

function getHighestBlockingPane (blockers) {
  return blockers.sort((a, b) => a.y + a.height < b.y + b.height ? -1 : 1)[0]
}

module.exports = function findNextGaps (grid, coords, gaps = [], blockers = []) {
  try {
    const gap = maxSizeAtPoint(grid, coords, gaps, blockers)
    const highestBlocker = getHighestBlockingPane(blockers)
    const highestBlockingPoint = highestBlocker
      ? highestBlocker.y + highestBlocker.height
      : 0
    if (gap.x + gap.width < grid.width) {
      return findNextGaps(grid, {x: gap.x + gap.width, y: coords.y},
        gaps.concat(gap),
        blockers.concat(gap)
      )
    } else if (highestBlockingPoint < grid.height) {
      return findNextGaps(grid, {x: 0, y: highestBlockingPoint},
        gaps.concat(gap)
      ) // erase blockers
    }
  } catch (e) {
    if (e.coords) {
      const blockingPanes = blockers.concat(e.coords)
      const highestBlocker = getHighestBlockingPane(blockingPanes)
      const highestBlockingPoint = highestBlocker
        ? highestBlocker.y + highestBlocker.height
        : 0
      if (e.coords.x + e.coords.width < grid.width) {
        return findNextGaps(grid, {x: e.coords.x + e.coords.width, y: coords.y},
          gaps, blockingPanes
        )
      } else if (highestBlockingPoint < grid.height) {
        return findNextGaps(grid, {x: 0, y: highestBlockingPoint}, gaps) // erase blockers
      }
    }
  }
  return gaps
}
