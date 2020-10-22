function isArray(instance) {
  return typeof instance === "object" && instance instanceof Array;
}

function isNumber(isstance) {
  return typeof instance === "number";
}

function isString(instance) {
  return typeof instance === "string";
}

function appendChildrenToNode(node, children) {
  for (let child of children) {
    if (child === null) {
      continue;
    }

    if (isNumber(child)) {
      node.appendChild(document.createTextNode(child.toString()));
    } else if (isString(child)) {
      node.appendChild(document.createTextNode(child));
    } else if (isArray(child)) {
      appendChildrenToNode(node, child);
    } else {
      node.appendChild(child);
    }
  }
}

export function noReactCreateElement(type, attrs, ...children) {
  const node = (function () {
    if (typeof type === "string") {
      const tagName = type;
      return document.createElement(tagName);
    }
    console.error("invalid type:", type);
    return document.createElement("div");
  })();

  for (let name in attrs) {
    node.setAttribute(name, attrs[name]);
  }

  appendChildrenToNode(node, children);
  return node;
}

function removeChildren(node) {
  while (true) {
    const child = node.firstElementChild;
    if (!child) break;
    node.removeChild(child);
  }
}

export function render(component, root) {
  removeChildren(root);
  root.appendChild(component);
}
