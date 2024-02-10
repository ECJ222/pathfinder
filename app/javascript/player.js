import { Gameboard } from "./gameboard";
import { isWithinBounds, isObstacle } from "./helper";

export class Player {
  constructor(screen, gameState) {
    this.gameState = gameState;
    this.playerElement = this.getPlayerElement();
    this.setStyle(this.playerElement);
    screen.appendChild(this.playerElement);
    this.addKeyboardListener();
    this.addButtonListener();
  }
  getPlayerElement() {
    return document.querySelector(".player") || this.createPlayerElement();
  }
  createPlayerElement() {
    const element = document.createElement("div");
    element.className = "player";
    return element;
  }
  setStyle(element, playerWon = false) {
    const { width: PlayerWidth, height: PlayerHeight } = this.getScaledProperties(this.gameState.cellProperties);
    Object.assign(element.style, {
      width: `${PlayerWidth}px`,
      height: `${PlayerHeight}px`,
      backgroundColor: playerWon ? "#fff" :  "#000",
      borderRadius: "50%",
      position: "absolute",
      left: `${PlayerWidth / 2}px`,
      top: `${PlayerHeight / 2}px`,
    });
    this.setInitialPosition(element);
  }
  setInitialPosition(element) {
    const [deltaX, deltaY] = this.getCurrentPoint();
    const {width, height} = this.gameState.cellProperties
    element.style.left = `${this.getXPosition(deltaX, width)}px`;
    element.style.top = `${this.getYPosition(deltaY, height)}px`;
  }
  getScaledProperties({ width, height }) {
    return {
      width: parseInt(width, 10) / 2,
      height: parseInt(height, 10) / 2,
    };
  }
  addKeyboardListener() {
    document.addEventListener("keydown", this.handleMovement.bind(this));
  }
  removeKeyboardListener() {
    document.removeEventListener("keydown", this.handleMovement.bind(this));
  }
  addButtonListener() {
    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
      button.addEventListener("click", this.handleMovement.bind(this));
    }
  }
  removeButtonListener() {
    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
      button.removeEventListener("click", this.handleMovement.bind(this));
    }
  }
  handleMovement(event) {
    const [left, right, up, down] = this.gameState.game.directions;
    const directionAction = {
      ArrowLeft: () => this.move(left),
      ArrowRight: () => this.move(right),
      ArrowUp: () => this.move(up),
      ArrowDown: () => this.move(down),
    };

    const action = directionAction[event.code || event.currentTarget.dataset.action];
    if (action) {
      action();
    }
  }
  move([deltaX, deltaY]) {
    const { currentPosition, cellProperties, obstacles, updatePosition } = this.gameState;
    const newPosition = {
      cell: currentPosition.cell + deltaY,
      column: currentPosition.column + deltaX,
    };

    if (this.isValidMove(newPosition, obstacles)) {
      updatePosition({ ...currentPosition, ...newPosition });
      this.updateElementPosition([deltaX, deltaY], cellProperties);
    }
  }
  isValidMove(newPosition, obstacles) {
    return isWithinBounds(newPosition) && !isObstacle(newPosition, obstacles);
  }
  getCurrentPoint() {
    const deltaX = this.gameState.currentPosition.column > Gameboard.startingNode ? this.gameState.currentPosition.column - 1 : 0;
    const deltaY = this.gameState.currentPosition.cell > Gameboard.startingNode ? this.gameState.currentPosition.cell - 1 : 0;

    return [deltaX, deltaY];
  }
  getXPosition(deltaX, width) {
    return parseFloat(this.playerElement.style.left, 10) + deltaX * parseFloat(width, 10);
  }
  getYPosition(deltaY, height) {
    return parseFloat(this.playerElement.style.top, 10) + deltaY * parseFloat(height, 10);
  }
  updateElementPosition([deltaX, deltaY], { width, height }) {
    this.playerElement.style.left = `${this.getXPosition(deltaX, width)}px`;
    this.playerElement.style.top = `${this.getYPosition(deltaY, height)}px`;
  }
  update(screen, gameState) {
    this.gameState = gameState;
    this.setStyle(this.playerElement);
    this.updateElementPosition([0, 0], this.gameState.cellProperties);
    screen.appendChild(this.playerElement);
  }
}
