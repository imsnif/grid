module.exports = function findObstruction (pane, sibling, direction) {
  const firstAxis = direction === 'up' || direction === 'down' ? 'x' : 'y'
  const secondAxis = direction === 'up' || direction === 'down' ? 'y' : 'x'
  const firstDimension = direction === 'up' || direction === 'down' ? 'width' : 'height'
  const secondDimension = direction === 'up' ? 'height' : 'width'
  if (
    sibling[firstAxis] < pane[firstAxis] + pane[firstDimension] &&
    sibling[firstAxis] + sibling[firstDimension] > pane[firstAxis] &&
    ((
      (direction === 'up' || direction === 'left') &&
      sibling[secondAxis] + sibling[secondDimension] <= pane[secondAxis]
    ) ||
    (
      (direction === 'down' || direction === 'right') &&
      sibling[secondAxis] > pane[secondAxis]
    ))
  ) {
    return (direction === 'up' || direction === 'left'
      ? sibling[secondAxis] + sibling[secondDimension]
      : sibling[secondAxis]
    )
  }
}
