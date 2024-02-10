import { Gameboard } from "./gameboard";

export const isWithinBounds = ({ cell, column }) => {
  return column >= Gameboard.startingNode && column <= Gameboard.cellDimension && cell >= Gameboard.startingNode && cell <= Gameboard.cellDimension;
};
export const isObstacle = (position, obstacles) => {
  return obstacles.some((obstacle) => isObjectEqual(obstacle, position));
}
export const isObjectEqual = (objectA, objectB) => {
  return JSON.stringify(objectA) === JSON.stringify(objectB);
};
export const getRandomCellPosition = () => {
  return Math.floor(Math.random() * Gameboard.cellDimension) + 1;
};
export const getRandomColumnPositionAvoidingFirst = () => {
  const minColumn = 2;
  const maxColumn = Gameboard.cellDimension;
  return Math.floor(Math.random() * (maxColumn - minColumn + 1)) + minColumn;
};
