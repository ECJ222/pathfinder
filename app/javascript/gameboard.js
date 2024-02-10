import { Player } from "./player";
import { Obstacles } from "./obstacles";
import { getShortestPath } from "./findpath";
import { getRandomCellPosition, getRandomColumnPositionAvoidingFirst, isObstacle } from "./helper";

export class Gameboard {
  static startingNode = 1;
  static cellDimension = 16;
  constructor() {
    this.setGameboardState();
  }
  setGameboardState() {
    this.startPosition = {
      cell: getRandomCellPosition(),
      column: Gameboard.startingNode,
    };
    this.currentPosition = {
      ...this.startPosition,
    };
    this.destinationPosition = {
      cell: getRandomCellPosition(),
      column: getRandomColumnPositionAvoidingFirst(),
    };
    this.directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    this.shortestPath = getShortestPath(this.startPosition, this.destinationPosition, this.directions);
    this.obstacles = new Obstacles().getObstacles(this.shortestPath);
    this.player = null;
    this.wherePlayerCameFrom = [{ ...this.currentPosition }];
  }
  draw() {
    const screen = document.querySelector(".game-board");
    this.clearGameBoard(screen);
    screen.append(...this.getCells(screen));
    const playerOptions = {
      game: this,
      currentPosition: this.currentPosition,
      cellProperties: this.getCellProperties(screen),
      obstacles: this.obstacles,
      updatePosition: this.updateGameBoardPosition.bind(this),
      isDestination: this.isDestination.bind(this),
    };
    if (!this.player) {
      this.player = new Player(screen, playerOptions);
    } else {
      this.player.update(screen, playerOptions);
    }
  }
  clearGameBoard(screen) {
    screen.innerHTML = "";
  }
  getCells(screen) {
    const cellProperties = this.getCellProperties(screen);
    const cells = [];
    for (let cellIndex = 1; cellIndex <= Gameboard.cellDimension; cellIndex++) {
      const cell = document.createElement("div");
      cell.classList.add(`cell-${cellIndex}`);
      this.setCellStyle(cell, cellProperties);
      cell.append(...this.getColumns(cellIndex, cellProperties));
      cells.push(cell);
    }
    return cells;
  }
  getCellProperties(screen) {
    return {
      width: `${screen.offsetWidth / Gameboard.cellDimension}px`,
      height: `${screen.offsetHeight / Gameboard.cellDimension}px`,
    };
  }
  setCellStyle(cell, cellProperties) {
    cell.style.width = "100%";
    cell.style.height = cellProperties.height;
    cell.style.display = "flex";
    if (!this.hasClassContaining(cell, `cell-${Gameboard.cellDimension}`)) {
      cell.style.borderBottom = "1px solid";
    }
  }
  getColumns(cellIndex, cellProperties) {
    const columns = [];
    for (let colIndex = 1; colIndex <= Gameboard.cellDimension; colIndex++) {
      const column = document.createElement("div");
      column.classList.add(`cell-${cellIndex}-column-${colIndex}`);
      const position = { cell: cellIndex, column: colIndex };
      this.setColumnStyle(column, cellProperties, { isObstacle: isObstacle(position, this.obstacles), isDestination: this.isDestination(position) });
      columns.push(column);
    }
    return columns;
  }
  setColumnStyle(column, cellProperties, { isObstacle, isDestination }) {
    column.style.width = cellProperties.width;
    column.style.height = "100%";
    if (isObstacle) {
      column.style.backgroundColor = "#000";
    }
    if (isDestination) {
      column.style.backgroundColor = "#ff0";
    }
    if (!this.hasClassContaining(column, `column-${Gameboard.cellDimension}`)) {
      column.style.borderRight = "1px solid";
    }
  }
  isDestination({ cell, column }) {
    return this.destinationPosition.cell === cell && this.destinationPosition.column === column;
  }
  hasClassContaining(element, substring) {
    return Array.from(element.classList).some((className) => className.includes(substring));
  }
  updateGameBoardPosition(position) {
    if (!this.isDestination(position)) {
      this.currentPosition.cell = position.cell;
      this.currentPosition.column = position.column;
      this.updateWherePlayerCameFrom(position);
    } else if (this.isDestination(position)) {
      this.updateWherePlayerCameFrom(position);
      this.checkIfPlayerWon();
    }
  }
  updateWherePlayerCameFrom(position) {
    this.wherePlayerCameFrom.push({ ...position });
  }
  checkIfPlayerWon() {
    if (this.isPlayerAndShortestPathEqual()) {
      this.playerHasWon();
    } else if (!this.isPlayerAndShortestPathEqual()) {
      this.playerHasLost();
    }
  }
  playerHasWon() {
    this.player.setStyle(this.player.playerElement, true);
    setTimeout(() => {
      alert("You won!");
      this.resetGame();
    }, 100);
    this.displayShortestPath();
  }
  playerHasLost() {
    setTimeout(() => {
      alert("You lost!");
      this.resetGame();
    }, 0);
    this.displayShortestPath();
    this.displayPathTaken();
  }
  isPlayerAndShortestPathEqual() {
    return JSON.stringify(this.wherePlayerCameFrom) === JSON.stringify(this.shortestPath);
  }
  displayShortestPath() {
    const screen = document.querySelector(".game-board");
    this.shortestPath.forEach((position) => {
      const cell = screen.querySelector(`.cell-${position.cell}`);
      const column = cell.querySelector(`.cell-${position.cell}-column-${position.column}`);
      if (!this.isDestination(position)) {
        column.style.backgroundColor = "#0f0";
      }
    });
  }
  displayPathTaken() {
    const screen = document.querySelector(".game-board");
    this.wherePlayerCameFrom.forEach((position) => {
      const cell = screen.querySelector(`.cell-${position.cell}`);
      const column = cell.querySelector(`.cell-${position.cell}-column-${position.column}`);
      if (!this.isDestination(position) && !this.positionIsInShortestPath(position)) {
        column.style.backgroundColor = "#f00";
      }
    });
  }
  positionIsInShortestPath(position) {
    return this.shortestPath.some((path) => JSON.stringify(path) === JSON.stringify(position));
  }
  resetGame() {
    this.player.removeKeyboardListener();
    this.player.removeButtonListener();
    this.setGameboardState();
    this.draw();
  }
}

export const gameboard = new Gameboard();
