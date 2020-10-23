export class Cons {
  constructor(car, cdr) {
    this.car = car;
    this.cdr = cdr;
  }

  m_debugString() {
    return `Cons(${debugString(this.car)}, ${debugString(this.cdr)})`;
  }
}

class ConsG {
  constructor(car, g) {
    this.car = car;

    if (g === null || g instanceof Cons) {
      this.realCdr = g;
      this.hasReadCdr = true;
    } else {
      this.cdrG = g;
      this.hasReadCdr = false;
    }
  }

  get cdr() {
    if (!this.hasReadCdr) {
      this.hasReadCdr = true;
      this.realCdr = consG(this.cdrG);
    }
    return this.realCdr;
  }
}

// make a cons from a iterator
export function consG(g) {
  const { value, done } = g.next();
  if (done) return null;
  return new ConsG(value, g);
}

export function cons(car, cdr) {
  return new Cons(car, cdr);
}

export function iteratorToList(iterator) {
  let { value, done } = iterator.next();
  if (done) return null;
  return cons(value, iteratorToList(iterator));
}

function arrayToListRange(array, begin, end) {
  if (end - begin == 0) return null;
  return cons(array[begin], arrayToListRange(array, begin + 1, end));
}

function arrayToList(array) {
  return arrayToListRange(array, 0, array.length);
}

export function listMap(list, fn) {
  if (list === null) return null;
  return cons(fn(list.car), listMap(list.cdr, fn));
}

export function listInspect(list, fn) {
  if (list === null) return;
  fn(list.car);
  listInspect(list.cdr, fn);
}

export function listFilter(list, fn) {
  if (list === null) return null;
  if (fn(list.car)) return cons(list.car, listFilter(list.cdr, fn));
  return listFilter(list.cdr, fn);
}

function newList(...xs) {
  return arrayToList(xs);
}

function listEqual(lhs, rhs) {
  if (lhs === null) return rhs === null;
  if (rhs === null) return false;
  if (lhs.car !== rhs.car) return false;
  return listEqual(lhs.cdr, rhs.cdr);
}

function listToArray(list) {
  const array = [];
  let current = list;
  while (current !== null) {
    array.push(current.car);
    current = current.cdr;
  }
  return array;
}

function debugString(what) {
  if (what === null) return "null";
  if (typeof what?.m_debugString === "function") return what.m_debugString();
  return what.toString();
}

function assertEqualFn(lhs, rhs, fn) {
  if (fn(lhs, rhs)) return;
  console.error("lhs", debugString(lhs));
  console.error("rhs", debugString(rhs));
  throw new Error("assert error");
}

function testCons() {
  function generator() {
    let i = -1;

    return {
      next: function () {
        if (i > 10) return { done: true };
        i += 1;
        return { done: false, value: i };
      },
    };
  }

  const list = listFilter(consG(generator()), (x) => x % 2 == 0);
  assertEqualFn(list, newList(0, 2, 4, 6, 8, 10), listEqual);
}

//testCons();
