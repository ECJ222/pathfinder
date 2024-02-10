import { isObjectEqual, getRandomCellPosition, getRandomColumnPositionAvoidingFirst } from "./helper";
export class Obstacles {
  getObstacles(shortestPath) {
    const obstacles = [];
    for (let i = 0; i < this.getObstacleCount(); i++) {
      const cellPosition = getRandomCellPosition();
      const columnPosition = getRandomColumnPositionAvoidingFirst();
      const obstacle = { cell: cellPosition, column: columnPosition };
      if (!this.isObstacleIn(shortestPath, obstacle)) {
        obstacles.push(obstacle);
      }
    }
    return obstacles;
  }
  getObstacleCount() {
    const minObstacleCount = 50;
    return Math.floor(Math.random() * 100) + minObstacleCount;
  }
  isObstacleIn(shortestPath, obstacle) {
    return Boolean(shortestPath.find((position) => isObjectEqual(position, obstacle)));
  }
}
