//import * as fn from "./fn";

const conf = {
  mapRows: 100,
  mapCols: 100,
  cellWall: 1,
  cellPass: 0,
  cellSearching: 2,
  cellWallColor: "black",
};

function loadMap(alt) {
  const localMap = localStorage["map"];
  if (localMap) return JSON.parse(localMap);
  return alt;
}

function dumpMap(map) {
  localStorage["map"] = JSON.stringify(map);
}

function onCellMouseMove(mouse, cell, map) {
  if (!mouse.down) return;

  let color, data;
  if (mouse.clear) {
    color = "";
    data = conf.cellPass;
  } else {
    color = conf.cellWallColor;
    data = conf.cellWall;
  }

  cell.element.style.backgroundColor = color;
  map[cell.index] = data;
}

class Cell {
  constructor(map, row, col) {
    this.element = document.createElement("div");
    this.index = row * conf.mapCols + col;

    this.element.classList.add("cell");

    if (map[this.index] == conf.cellWall) {
      this.renderWall();
    }
  }

  renderWall() {
    this.element.style.backgroundColor = conf.cellWallColor;
  }
}

function main() {
  const map = loadMap(Array(conf.mapRows * conf.mapCols).fill(conf.cellPass));
  const container = document.getElementById("container");
  const mouse = { down: false, clean: false };

  document
    .getElementById("btn-save")
    .addEventListener("click", () => dumpMap(map));

  for (let row = 0; row < conf.mapRows; row++) {
    for (let col = 0; col < conf.mapCols; col++) {
      const cell = new Cell(map, row, col);

      cell.element.addEventListener("mousemove", () =>
        onCellMouseMove(mouse, cell, map)
      );
      container.appendChild(cell.element);
    }
    container.appendChild(document.createElement("br"));
  }

  container.addEventListener("mousedown", (event) => {
    mouse.down = true;
    mouse.clear = event.which == 3; // left mouse button
  });

  container.addEventListener("mouseup", () => {
    mouse.down = false;
  });

  container.addEventListener("contextmenu", (event) => event.preventDefault());
}

function mapIndex(r, c) {
  return r * conf.mapCols + c;
}

function findPath(map, start, end) {
  const queue = [start];

  function enqueue(r, c) {
    if (r < 0 || r >= conf.mapRows)
      return;
    if (c < 0 || c >= conf.mapCols)
      return;

    const index = mapIndex(r, c);
    const data = map[index];

    if (data != conf.cellPass)
      return;

    map[index] = conf.cellSearching;
    queue.push([r, c]);
  }

  function dequeue() {
    const rc = queue.shift();
    const index = mapIndex(r, c);
    map[index] = conf.cellPass;
    return rc;
  }

  while (queue.length) {
    const [r, c] = dequeue();

    if (r == end[0] && c == end[1]) {
      return true;
    }

    for (const dr = -1; dr <= 1; dr += 2) {
      for (const dc = -1; dc <= 1; dr += c) {
        queue(r + dr, c + dc);
      }
    }
  }
}

main();
