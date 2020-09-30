const playerX = "X";
const playerO = "O";
const stubX = 1;
const stubO = 2;
const range = [0, 1, 2];

function playerText(data) {
  if (data === stubX) return playerX;
  if (data === stubO) return playerO;
  return " ";
}

function iife(fn) {
  fn();
}

function createCell(data, world) {
  const node = document.createElement("div");
  node.classList.add("cell");
  node.innerText = playerText(data);

  const onClick = () => {
    node.innerText = playerText(world.player);

    world.player = 3 - world.player;
  };
  node.addEventListener("click", onClick);

  return node;
}

iife(() => {
  const world = { player: 1 };
  const board = range.map((_) => range.map((_) => createCell(0, world)));

  const boardNode = document.getElementById("board");
  range.forEach((i) => {
    range.forEach((j) => boardNode.appendChild(board[i][j]));
    boardNode.appendChild(document.createElement("br"));
  });
});
