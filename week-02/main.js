//import * as fn from "./fn";

const conf = {
  mapRows: 100,
  mapCols: 100,

  cellMark: 2,
  cellWall: 1,
  cellEmpty: 0,
};

function cellColor(data) {
  switch (data) {
    case conf.cellEmpty:
      return "gray";
    case conf.cellWall:
      return "black";
    case conf.cellMark:
      return "red";
    default:
      console.error("unexpected data", data);
      return "gray";
  }
}

function loadMap(alt) {
  const localMap = localStorage["map"];
  if (localMap) return JSON.parse(localMap);
  return alt;
}

function onCellMouseMove(mouse, cell) {
  if (!mouse.down) return;

  let data;
  if (mouse.clear) {
    data = conf.cellEmpty;
  } else {
    data = conf.cellWall;
  }

  cell.setData(data);
}

class Map {
  constructor(mapList) {
    const map = loadMap(
      Array(conf.mapRows * conf.mapCols).fill(conf.cellEmpty)
    );
    this.cellList = map.map((data, index) => new Cell(data, index));
  }

  get([r, c]) {
    return this.cellList[mapIndex(r, c)];
  }

  save() {
    localStorage["map"] = JSON.stringify(
      this.cellList.map((cell) => {
        if (cell.data == conf.cellMark) return conf.cellEmpty;
        return cell.data;
      })
    );
  }
}

class Cell {
  constructor(data, index) {
    this.element = document.createElement("div");
    this.index = index;
    this.setData(data);
    this.row = Math.floor(index / conf.mapCols);
    this.col = index % conf.mapCols;

    this.element.classList.add("cell");
    this.element.setAttribute("title", `(${this.row}, ${this.col}) - ${index}`);
  }

  setData(data) {
    if (data == this.data) return;
    this.data = data;
    this.element.style.backgroundColor = cellColor(data);
  }
}

function main() {
  const map = new Map();

  const container = document.getElementById("container");
  const mouse = { down: false, clean: false };

  document
    .getElementById("btn-save")
    .addEventListener("click", () => map.save());

  for (let row = 0; row < conf.mapRows; row++) {
    for (let col = 0; col < conf.mapCols; col++) {
      const cell = map.get([row, col]);

      cell.element.addEventListener("mousemove", () =>
        onCellMouseMove(mouse, cell)
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

  // text area
  findPath(map, [0, 0], [10, 10]);
}

function mapIndex(r, c) {
  return r * conf.mapCols + c;
}

function findPath(map, start, end) {
  console.log(start, end);
  const queue = [start];

  const cell = map.get(start);
  if (cell.data != conf.cellEmpty) return false;
  cell.setData(conf.cellMark);

  function enqueue([r, c]) {
    if (r < 0 || r >= conf.mapRows) return;
    if (c < 0 || c >= conf.mapCols) return;

    const cell = map.get([r, c]);

    if (cell.data != conf.cellEmpty) return;
    cell.setData(conf.cellMark);

    queue.push([r, c]);
  }

  console.log(queue);
  while (queue.length > 0) {
    const [r, c] = queue.shift();

    for (const [dr, dc] of [
      [0, 1],
      [0, -1],
      [-1, 0],
      [1, 0],
    ]) {
      const next = [r + dr, c + dc];
      if (next[0] == end[0] && next[1] == end[1]) {
        map.get(next).setData(conf.cellMark);
        console.log("found", end);
        return true;
      }
      enqueue(next);
    }
  }
  return false;
}

main();
