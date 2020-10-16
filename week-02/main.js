import { TreeSet } from "jstreemap";

const conf = {
  mapRows: 100,
  mapCols: 100,

  cellWall: 1,
  cellEmpty: 0,
};

function sleep(time) {
  return new Promise((resolve, reject) => setTimeout(resolve, time));
}

function cellColor(data) {
  switch (data) {
    case conf.cellEmpty:
      return "gray";
    case conf.cellWall:
      return "black";
    default:
      console.error("unexpected data", data);
      return "gray";
  }
}

class TreeQueue {
  constructor(initial, compare) {
    this.treeSet = new TreeSet();
    this.treeSet.compareFunc = compare;

    for (const each of initial) {
      this.treeSet.add(each);
    }
    this.compare = compare;
  }

  enqueue(data) {
    this.treeSet.add(data);
  }

  dequeue() {
    const it = this.treeSet.begin();
    this.treeSet.erase(it);
    return it.key;
  }

  get length() {
    return this.treeSet.size;
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

  async recoverPath(start, end) {
    const path = [];
    let current = end;

    while (!samePoint(current, start)) {
      const cell = this.get(current);
      cell.setColor("red");
      path.push(current);

      if (cell.previous === null) {
        console.log("unexpected previous", cell);
        return null;
      }
      await sleep(30);
      current = cell.previous;
    }
    return path;
  }

  save() {
    localStorage["map"] = JSON.stringify(
      this.cellList.map((cell) => cell.data)
    );
  }
}

class Cell {
  constructor(data, index) {
    this.element = document.createElement("div");
    this.index = index;
    this.setData(data);
    this.previous = null;
    this.fromStart = null;

    this.element.classList.add("cell");

    const row = Math.floor(index / conf.mapCols);
    const col = index % conf.mapCols;
    this.element.setAttribute("title", `(${row}, ${col}) - ${index}`);
  }

  setData(data) {
    if (data == this.data) return;
    this.data = data;
    this.element.style.backgroundColor = cellColor(data);
  }

  setColor(color) {
    this.element.style.backgroundColor = color;
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

  // test area
  findPath(map, [0, 0], [10, 10]);
}

function mapIndex(r, c) {
  return r * conf.mapCols + c;
}

function samePoint(lhs, rhs) {
  return lhs[0] == rhs[0] && lhs[1] == rhs[1];
}

async function findPath(map, start, end) {
  function distance(point) {
    return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2;
  }

  const queue = new TreeQueue(
    [start],
    (lhs, rhs) => distance(lhs) - distance(rhs)
  );

  const cell = map.get(start);
  if (cell.data != conf.cellEmpty) return false;

  cell.setColor("lightgreen");
  cell.fromStart = 0;

  async function enqueue([r, c], previous) {
    if (r < 0 || r >= conf.mapRows) return;
    if (c < 0 || c >= conf.mapCols) return;

    const cell = map.get([r, c]);
    if (cell.data != conf.cellEmpty) return;

    const candidate = map.get(previous);

    const better = (function () {
      if (cell.previous === null) return true;

      return candidate.fromStart + 1 < cell.fromStart;
    })();

    if (!better) {
      return;
    }

    cell.previous = previous;
    cell.fromStart = candidate.fromStart + 1;
    cell.setColor("lightgreen");
    queue.enqueue([r, c]);
  }

  while (queue.length > 0) {
    const [r, c] = queue.dequeue();

    const deltas = [
      [0, 1],
      [0, -1],
      [-1, 0],
      [1, 0],
    ];
    for (const [dr, dc] of deltas) {
      if (dr == 0 && dc == 0) continue;

      const next = [r + dr, c + dc];
      if (samePoint(next, end)) {
        const cell = map.get(next);

        cell.setColor("lightgreen");
        cell.previous = [r, c];

        return await map.recoverPath(start, end);
      }

      await enqueue(next, [r, c]);
    }
  }
  return null;
}

main();
