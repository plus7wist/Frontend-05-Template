class DefaultMap extends Map {
  constructor() {
    super();
  }

  setDefault(key, value) {
    if (!this.has(key)) this.set(key, value);
    return this.get(key);
  }

  getDefault(key, value) {
    return this.has(key) ? this.get(key) : value;
  }

  setDefaultFn(key, fn) {
    if (!this.has(key)) this.set(key, fn());
    return this.get(key);
  }
}

class Reactive {
  constructor() {
    this.effectCallbackUse = [];
    this.callbackMap = new DefaultMap();

    this.proxyCache = new DefaultMap();
    this.proxyConfig = {
      get: this.get.bind(this),
      set: this.set.bind(this),
    };

    this.reactiveFn = this.reactive.bind(this);
    this.effectFn = this.effect.bind(this);
  }

  get(that, prop) {
    this.effectCallbackUse.push([that, prop]);
    if (typeof prop === "function") {
      return this.reactive(that[prop]);
    }
    return that[prop];
  }

  set(that, prop, value) {
    that[prop] = value; // before callbacks

    const callbacks = this.callbackMap
      .getDefault(that, new DefaultMap())
      .getDefault(prop, []);

    for (const callback of callbacks) {
      callback();
    }

    return that[prop];
  }

  reactive(object) {
    const getProxy = () => new Proxy(object, this.proxyConfig);
    return this.proxyCache.setDefaultFn(object, getProxy);
  }

  effect(callback) {
    this.effectCallbackUse = [];

    // If that.prop is used in callback, proxy will push [that, prop] into
    // this.effectCallbackUse.
    callback();

    for (const [that, prop] of this.effectCallbackUse) {
      this.callbackMap
        .setDefault(that, new DefaultMap())
        .setDefault(prop, [])
        .push(callback);
    }
  }
}

// Share and shortcuts.

const reactiveShare = new Reactive();

const reactive = reactiveShare.reactiveFn;
const effect = reactiveShare.effectFn;

// Testing.

const color = reactive({
  r: 0,
  g: 0,
  b: 0,
});

const newColorChannelInput = (color, channel) => {
  const input = document.createElement("input");

  input.setAttribute("type", "range");
  input.setAttribute("min", 0);
  input.setAttribute("max", 255);

  effect(() => {
    console.log("effect on color", channel);
    input.value = color[channel];
  });

  input.addEventListener("input", (e) => {
    color[channel] = e.target.value;
  });

  return input;
};

const inputR = newColorChannelInput(color, "r");
const inputG = newColorChannelInput(color, "g");
const inputB = newColorChannelInput(color, "b");

const canvas = document.createElement("div");
canvas.style.width = "100px";
canvas.style.height = "100px";

effect(() => {
  canvas.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
});

const root = document.getElementById("root");

root.appendChild(inputR);
root.appendChild(inputG);
root.appendChild(inputB);
root.appendChild(canvas);
