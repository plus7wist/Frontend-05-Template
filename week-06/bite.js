class Role {
  constuctor(attack, defence, healthPoint) {
    this.attack = attack;
    this.defence = defence;
    this.healthPoint = healthPoint;
    this.alive = true;
  }

  hurt(damage) {
    this.healthPoint -= damage;

    if (this.healthPoint < 0) {
      this.alive = false;
      this.healthPoint = 0;
    }
  }
}

class Dog extends Role {
  constructor(attack) {
    super(attack, 0, 0);
  }

  // bite makes more damage then normal attack(strike).
  biteAttack() {
    return this.attack * 1.5;
  }
}

class Human extends Role {
  constructor(attack, defence, healthPoint) {
    super(attack, defence, healthPoint);
  }
}

function dogBiteHuman(dog, human) {
  human.hurt(dog.biteAttack() - human.defence);
}
