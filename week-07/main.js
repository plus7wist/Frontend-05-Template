var set = new Set();

var queue = [
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "Array",
  "Date",
  "RegExp",
  "Promise",
  "Proxy",
  "Map",
  "WeakMap",
  "Set",
  "WeakSet",
  "Function",
  "Boolean",
  "String",
  "Number",
  "Symbol",
  "Object",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint16Array",
  "Uint32Array",
  "Uint8ClampedArray",
  "Atomics",
  "JSON",
  "Math",
  "Reflect",
].map((o) => window[o]);

var childrenMap = new Map();

function addChild(object, child) {
  if (!childrenMap.has(object)) childrenMap.set(object, []);
  childrenMap.get(object).push(child);
}

function enqueue(root, what) {
  if (set.has(what)) return;
  set.add(what);
  queue.push(what);
  addChild(root, what);
  console.log("enqueue", what);
}

for (var i = 0; i < queue.length; i++) {
  var o = queue[i];
  if (o === undefined) continue;

  for (var p of Object.getOwnPropertyNames(o)) {
    var d = Object.getOwnPropertyDescriptor(o, p);
    var v = d.value;
    var t = typeof d.value;

    // 'v' is object or function
    if ((v !== null && t === "object") || t === "function") enqueue(d, v);

    d.get && enqueue(d, d.get);
    d.set && enqueue(d, d.set);
  }
}

const graph = new G6.Graph({ container: "g6-root", width: 800, height: 800 });

function makeGraphData() {
  const nodes = [];
  const nodeMap = new Map();

  for (const object of queue) {
    if (object === undefined) continue;
    let node = { id: object, children: [] };

    nodeMap.set(object, node);
    nodes.push(node);
  }

  for (const object of queue) {
    console.log(object);
    const node = nodeMap[object];
    if (!childrenMap.has(object)) continue;

    for (const child of childrenMap.get(object)) {
      node.children.push(nodeMap.get(child));
    }
  }

  return { nodes: nodes };
}

graph.data(makeGraphData());
graph.render();
