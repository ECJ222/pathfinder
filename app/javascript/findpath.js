import { isWithinBounds, isObjectEqual } from "./helper";

export const getShortestPath = (startPosition, destinationPosition, directions) => {
  const pathState = {
    startPosition,
    destinationPosition,
    directions,
    consideredPathsToDestination: [startPosition],
    smartGuessToDestinationPath: new Map(),
    pathPlayerCameFrom: new Map(),
    playerStepsCounterFromStart: new Map(),
  };
  initializePathFinding(pathState);
  while (hasPathsToConsider(pathState)) {
    const currentPosition = chooseNextPath(pathState);
    if (isDestinationReached(currentPosition, pathState)) {
      return reconstructPath(currentPosition, pathState);
    }
    removeConsideredPath(currentPosition, pathState);
    exploreAdjacentPaths(currentPosition, pathState);
  }
  return [];
};
const initializePathFinding = (pathState) => {
  const startingStepCount = 0;
  pathState.playerStepsCounterFromStart.set(pathState.startPosition, startingStepCount);
  const startToDestinationDistance = guessDistance(pathState.startPosition, pathState.destinationPosition);
  pathState.smartGuessToDestinationPath.set(pathState.startPosition, startToDestinationDistance);
};
const hasPathsToConsider = (pathState) => {
  return pathState.consideredPathsToDestination.length > 0;
};
const chooseNextPath = (pathState) => {
  return pathState.consideredPathsToDestination.reduce((bestPath, currentPath) =>
    getEstimatedTotalDistance(bestPath, pathState) < getEstimatedTotalDistance(currentPath, pathState) ? bestPath : currentPath
  );
};
const getEstimatedTotalDistance = (position, pathState) => {
  return pathState.smartGuessToDestinationPath.get(position);
};
const isDestinationReached = (position, pathState) => {
  return isObjectEqual(position, pathState.destinationPosition);
};
const removeConsideredPath = (position, pathState) => {
  pathState.consideredPathsToDestination = pathState.consideredPathsToDestination.filter(
    (consideredPosition) => !isObjectEqual(consideredPosition, position)
  );
};
const exploreAdjacentPaths = (position, pathState) => {
  updateNextStepsFrom(position, pathState);
};
const reconstructPath = (destination, pathState) => {
  return getPath(destination, pathState);
};
const guessDistance = (position, destination) => {
  return Math.abs(position.cell - destination.cell) + Math.abs(position.column - destination.column);
};
const getPath = (position, pathState) => {
  let path = [position];
  while (pathState.pathPlayerCameFrom.has(position)) {
    position = pathState.pathPlayerCameFrom.get(position);
    path.unshift(position);
  }

  return path;
};
const updateNextStepsFrom = (position, pathState) => {
  const nextSteps = getSteps(position, pathState);

  nextSteps.forEach((nextStep) => {
    const newStepCount = getCurrentStepCount(position, pathState) + 1;
    const newPath = { nextStep, newStepCount, currentPosition: position };
    if (shouldUpdatePath(pathState, newPath)) {
      updatePathTo(pathState, newPath);
      considerPathIfNew(pathState, nextStep);
    }
  });
};
const getSteps = (position, pathState) => {
  const steps = [];
  for (const [deltaX, deltaY] of pathState.directions) {
    const newPosition = {
      cell: position.cell + deltaY,
      column: position.column + deltaX,
    };
    if (isWithinBounds(newPosition)) {
      steps.push(newPosition);
    }
  }
  return steps;
};
const getCurrentStepCount = (position, pathState) => {
  return pathState.playerStepsCounterFromStart.get(position);
};
const shouldUpdatePath = (pathState, { nextStep, newStepCount }) => {
  return !pathState.playerStepsCounterFromStart.has(nextStep) || newStepCount < pathState.playerStepsCounterFromStart.get(nextStep);
};
const updatePathTo = (pathState, { nextStep, newStepCount, currentPosition }) => {
  pathState.pathPlayerCameFrom.set(nextStep, currentPosition);
  pathState.playerStepsCounterFromStart.set(nextStep, newStepCount);
  const estimatedDistance = guessDistance(nextStep, pathState.destinationPosition);
  pathState.smartGuessToDestinationPath.set(nextStep, newStepCount + estimatedDistance);
};
const considerPathIfNew = (pathState, nextStep) => {
  const isNewPath = !isPathConsidered(nextStep, pathState.consideredPathsToDestination);
  if (isNewPath) {
    pathState.consideredPathsToDestination.push(nextStep);
  }
};
const isPathConsidered = (nextStep, consideredPathsToDestination) => {
  return consideredPathsToDestination.some((consideredPosition) => isObjectEqual(consideredPosition, nextStep));
};
