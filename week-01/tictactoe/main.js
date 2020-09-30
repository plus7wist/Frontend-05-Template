const playerX = "X";
const playerO = "O";
const stubX = 1;
const stubO = 2;
const range = [0, 1, 2];

const scoreWin = 1;
const scoreTie = 0;
const scoreLose = -1;

function playerText(data) {
  if (data === stubX) return playerX;
  if (data === stubO) return playerO;
  return " ";
}

function iife(fn) {
  fn();
}

class Game {
  constructor() {
    this.player = 1;
    this.board = range.map((_) => range.map((_) => new Cell(this)));
    this.over = false;
  }

  isWin() {
    const board = this.board;
    const player = this.player;
    return (
      range.some((i) => range.every((j) => board[i][j].data === player)) ||
      range.some((j) => range.every((i) => board[i][j].data === player)) ||
      range.every((i) => board[i][i].data === player) ||
      range.every((i) => board[i][2 - i].data == player)
    );
  }

  move(cell) {
    cell.setData(this.player);
  }

  willWin() {
    let resultCell;

    const win = range.some((i) =>
      range.some((j) => {
        const cell = this.board[i][j];
        if (cell.data != 0) return false;

        const win = cell.swapData(this.player, (backup, data) => this.isWin());
        if (!win) return false;

        resultCell = [i, j];
        return true;
      })
    );

    if (!win) return null;
    return resultCell;
  }

  // return { score, move }
  bestMove() {
    let move = this.willWin();
    if (move !== null) return { score: scoreWin, move };

    let score = scoreLose;
    let tie = true;

    range.some((i) =>
      range.some((j) => {
        const cell = this.board[i][j];
        const backup = cell.data;

        if (backup !== 0) return false;
        tie = false;

        cell.catlikeSetData(this.player);
        this.togglePlayer();
        const result = this.bestMove();

        cell.catlikeSetData(backup);
        this.togglePlayer();

        const myScore = -result.score;
        if (myScore > score) {
          score = myScore;
          move = [i, j];
        }

        if (myScore === scoreWin) {
          return true;
        }

        return false;
      })
    );
    if (tie) return { score: scoreTie, move: null };
    return { score, move };
  }

  togglePlayer() {
    this.player = 3 - this.player;
  }
}

class Cell {
  constructor(game) {
    this.data = 0;
    this.clicked = false;

    this.node = document.createElement("div");
    this.node.classList.add("cell");

    this.setData(0);

    const onClick = () => {
      if (this.clicked || game.over) return;
      this.clicked = true;

      game.move(this);
      if (game.isWin()) {
        game.over = true;
        alert(playerText(game.player) + " win!");
      }

      game.togglePlayer();

      const { score, move } = game.bestMove();
      console.log(
        score === scoreWin ? "win" : score === scoreTie ? "tie" : "lose",
        move
      );
    };
    this.node.addEventListener("click", onClick);
  }

  setData(data) {
    this.data = data;
    this.node.innerText = playerText(data);
  }

  catlikeSetData(data) {
    this.data = data;
  }

  swapData(data, onSwap) {
    const backup = this.data;

    this.data = data;
    const result = onSwap(backup, data);
    this.data = backup;

    return result;
  }

  isPlayer(player) {
    return this.data === player;
  }
}

iife(() => {
  const world = { player: 1 };
  const game = new Game();

  const boardNode = document.getElementById("board");
  range.forEach((i) => {
    range.forEach((j) => boardNode.appendChild(game.board[i][j].node));
    boardNode.appendChild(document.createElement("br"));
  });
});
