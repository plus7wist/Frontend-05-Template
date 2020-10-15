import * as fn from "./fn";

const mapRows = 100;
const mapCols = 100;
const mapCellWall = 1;
const mapCellPass = 0;
const mapCellWallColor = "black";

//const mapRowRange = [...Array(mapRows).keys()];
//const mapColRange = [...Array(mapCols).keys()];

function loadMap(alt) {
  const localMap = localStorage["map"];
  if (localMap) return JSON.parse(localMap);
  return alt;
}

function dumpMap(map) {
  localStorage["map"] = JSON.stringify(map);
}

class MouseStatus {
  constructor() {
    this.down = false;
    this.clean = false;
  }
}

function main() {
  const map = loadMap(Array(mapRows * mapCols).fill(mapCellPass));
  const container = document.getElementById("container");
  const mouse = new MouseStatus();

  document
    .getElementById("btn-save")
    .addEventListener("click", () => dumpMap(map));

  container.style.width = `${mapCols * 7 + 1}px`;

  fn.range(mapRows).forEach((row) => {
    fn.range(mapCols).forEach((col) => {
      const cell = document.createElement("div");
      const cellIndex = row * mapCols + col;

      cell.classList.add("cell");
      if (map[cellIndex] == mapCellWall)
        cell.style.backgroundColor = mapCellWallColor;

      cell.addEventListener("mousemove", () => {
        if (!mouse.down) return;

        let color, data;
        if (mouse.clear) {
          color = "";
          data = mapCellPass;
        } else {
          color = mapCellWallColor;
          data = mapCellWall;
        }
        cell.style.backgroundColor = color;
        map[cellIndex] = data;
      });

      container.appendChild(cell);
    });
  });

  container.addEventListener("mousedown", (event) => {
    mouse.down = true;
    mouse.clear = event.which == 3;
  });
  container.addEventListener("mouseup", () => {
    mouse.down = false;
  });
  container.addEventListener("contextmenu", (event) => event.preventDefault());
}

class ConsoleLogger {
  constructor() {
    this.off = false;
  }

  log(...args) {
    if (this.off) return;
    console.log(...args);
  }
}

main();
