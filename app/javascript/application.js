// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";
import { gameboard } from "./gameboard";

function loadGame() {
  gameboard.draw();
}

window.onload = loadGame;

function handleResize() {
  loadGame();
}

window.addEventListener("resize", handleResize);
