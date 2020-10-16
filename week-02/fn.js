export class Option {
  constructor(none, value) {
    this.none_ = none;
    this.value_ = value;
  }

  static just(value) {
    return new Option(false, value);
  }

  static none() {
    return new Option(true, null);
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
  return Option.just(value);
}

export function none() {
  return Option.none();
}

/// Either join two types.
export class Either {
  constructor(left, value) {
    this.left_ = left;
    this.value_ = value;
  }

  static lhs(value) {
    return this(true, value);
  }

  static rhs(value) {
    return this(false, value);
  }

  isLhs() {
    return this.left_;
  }
  isRhs() {
    return !this.left_;
  }

  // apply fn on lhs
  mapl(fn) {
    return this.isLhs() ? Either.lhs(fn(this.value_)) : this;
  }

  // apply fn on rhs
  mapr(fn) {
    return this.isLhs() ? this : Either.rhs(fn(this.value_));
  }

  // get lhs or value
  lor(value) {
    return this.isLhs() ? this.value_ : value;
  }

  // get rhs or value
  ror(value) {
    return this.isLhs() ? value : this.value_;
  }
}

// Result is either value or a error
class Result extends Either {
  static ok(value) {
    return this.lhs(value);
  }

  static err(value) {
    return this.rhs(value);
  }

  isOk() {
    return this.isLhs();
  }
  isErr() {
    return this.isRhs();
  }

  map(fn) {
    return this.mapl(fn);
  }

  mapErr(fn) {
    return this.mapr(fn);
  }

  // fn(T) -> Result<T, E>
  then(fn) {
    return this.isOk() ? fn(this.value_) : this;
  }

  thenErr(fn) {
    return this.isOk() ? this : fn(this.value_);
  }

  or(value) {
    return this.lor(value);
  }

  orErr(value) {
    return this.ror(value);
  }
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

  enumerate() {
    let count = -1;
    return this.map((each) => {
      count += 1;
      return [count, each];
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
  let current = -1;
  return new Iterator(() => {
    if (current >= end) return none();
    current += 1;
    return just(current);
  });
}
