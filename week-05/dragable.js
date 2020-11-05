// Create box to be dragged.

const box = document.createElement("div");

box.style.width = "100px";
box.style.height = "100px";
box.style.backgroundColor = "gray";
box.style.display = "inline-block";

box.addEventListener("mousedown", boxMouseDown);

// text container

const container = document.createElement("div");
container.appendChild(newFakeTextNote());
container.addEventListener("selectstart", (event) => event.preventDefault());
const gapRanges = collectContainerGapRange(container);

// render

const root = document.getElementById("root");
root.appendChild(container);
root.appendChild(box);

// About container.

function collectContainerGapRange(container) {
  const ranges = [];

  const textNode = container.childNodes[0];
  for (let i = 0; i < textNode.textContent.length; i++) {
    const range = document.createRange();
    range.setStart(textNode, i);
    range.setEnd(textNode, i);
    ranges.push(range);
  }
  return ranges;
}

// Create a text node contains simple text.
function newFakeTextNote() {
  const text = [];

  for (let i = 0; i < 30; i++) {
    for (let _ = 0; _ < 10; _++) {
      text.push("文字");
    }
    text.push(String.fromCharCode(160));
  }

  return document.createTextNode(text.join(" "));
}

function findNearestGap([x, y]) {
  const [min, minRange] = gapRanges.reduce(
    ([min, minRange], range) => {
      const rect = range.getBoundingClientRect();
      const distance = (x - rect.x) ** 2 + (y - rect.y) ** 2;

      if (distance < min) {
        return [distance, range];
      } else {
        return [min, minRange];
      }
    },
    [Infinity, null]
  );
  return minRange;
}

// About box.

const boxInitialRect = box.getBoundingClientRect();
let boxDelta = [boxInitialRect.x, boxInitialRect.y];

function boxMouseDown(event) {
  const start = [event.clientX, event.clientY];

  function boxMouseMove(event) {
    const current = vectorAdd(
      boxDelta,
      vectorSub([event.clientX, event.clientY], start)
    );

    // box.style.transform = `translate(${trX}px, ${trY}px)`;
    const range = findNearestGap(current);
    range.insertNode(box);
  }

  function boxMouseUp(event) {
    boxDelta = vectorAdd(
      boxDelta,
      vectorSub([event.clientX, event.clientY], start)
    );
    document.removeEventListener("mousemove", boxMouseMove);
    document.removeEventListener("mouseup", boxMouseUp);
  }

  document.addEventListener("mousemove", boxMouseMove);
  document.addEventListener("mouseup", boxMouseUp);
}

function vectorAdd([lx, ly], [rx, ry]) {
  return [lx + rx, ly + ry];
}

function vectorSub([lx, ly], [rx, ry]) {
  return [lx - rx, ly - ry];
}
