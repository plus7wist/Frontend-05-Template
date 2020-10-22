export class Cons {
  constructor(car, cdr) {
    this.car = car;
    this.cdr = cdr;
  }
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
  if (list === null) return null;
  fn(list.car);
  listInspect(list.cdr, fn);
}

export function listFilter(list, fn) {
  if (list === null) return null;
  if (fn(list.car)) return cons(list.car, listFilter(list.cdr, fn));
  return listFilter(list.cdr, fn);
}
