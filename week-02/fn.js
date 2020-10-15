export class Option {
  constructor(none, value) {
    this.none_ = none;
    this.value_ = value;
  }

  is_none() {
    return this.none_;
  }

  is_just() {
    return !this.none_;
  }

  map(fn) {
    return this.none_ ? this : just(fn(this.value_));
  }

  or(value) {
    return this.none_ ? value : this.value_;
  }
}

export function just(value) {
  return new Option(false, value);
}

export function none() {
  return new Option(true, null);
}

export class Either {
  constructor(left, value) {
    this.left_ = left;
    this.value_ = value;
  }

  // apply fn on lhs
  mapl(fn) {
    return this.left_ ? fn(this.value_) : this.value_;
  }
  // apply fn on rhs
  mapr(fn) {
    return this.left_ ? this.value_ : fn(this.value_);
  }

  // get lhs or value
  lor(value) {
    return this.left_ ? this.value_ : value;
  }
  // get rhs or value
  ror(value) {
    return this.left_ ? value : this.value_;
  }
}

export function lhs(value) {
  return Either(true, value);
}

export function rhs(value) {
  return Either(false, value);
}

export class Iterator {
  constructor(nextFn) {
    this.iterator = { next: nextFn };
  }

  take(total) {
    return this.takeStep(total, 1);
  }

  takeStep(maxCount, step) {
    let count = 0;
    return new Iterator(() => {
      if (count > maxCount) return none();
      count += step;
      return this.iterator.next();
    });
  }

  map(fn) {
    return new Iterator(() => {
      return this.iterator.next().map(fn);
    });
  }

  forEach(fn) {
    return this.map(fn).consume();
  }

  // fn(T) -> bool
  filter(fn) {
    return new Iterator(() => {
      while (true) {
        const item = this.iterator.next();
        if (item.map(fn).or(false)) return item;
      }
    });
  }

  // fn(T) -> Option<T>
  filter_map(fn) {
    return new Iterator(() => {
      while (true) {
        const item = this.iterator.next();

        // end filter_map when iterator reach end
        if (item.is_none()) return item;

        const maped = item.map(fn);

        // skip none under filter
        if (!maped.is_just()) continue;

        return maped;
      }
    });
  }

  fold(initial, mergeFn) {
    let current = initial;

    while (true) {
      const done = this.iterator
        .next()
        .map((item) => {
          current = mergeFn(current, item);
        })
        .is_none();
      if (done) return current;
    }
  }

  // generate
  collect() {
    return this.fold([], (array, item) => {
      array.push(item);
    });
  }

  // consume iterator, use side effect
  consume() {
    this.fold(null, (_, item) => _);
  }
}

export function range(end) {
  let current = 0;
  return new Iterator(() => {
    if (current >= end) return none();
    const result = just(current);
    current += 1;
    return result;
  });
}
