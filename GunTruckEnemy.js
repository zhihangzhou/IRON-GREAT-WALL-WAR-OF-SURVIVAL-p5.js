/*******************************************************************
@file GunTruckEnemy.js
@description This file is the GunTruckEnemy class, which is the enemy vehicle that moves horizontally, detects the player within a range, and fires bullets at regular speed.
@author George Zhou
@version 2.5.0
@date 2025-06-08
*******************************************************************/

class GunTruckEnemy {
  constructor(x, y, img, scale = 0.5) {
    this.img = img;
    this.scale = scale;

    this.originalW = img.width;
    this.originalH = img.height;
    this.width = this.originalW * this.scale;
    this.height = this.originalH * this.scale;
    this.pos = createVector(x, y);
    this.speed = 1.8;
    this.facingright = false;
    this.fireCooldown = 0;
    this.bullets = [];
    this.health = 40;
  }

update() {
  let distanceToPlayer = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);

  const sightRange = 1200; 
  const stopRange = 600;  

  if (distanceToPlayer < sightRange) {
    this.facingright = player.pos.x > this.pos.x;

    if (distanceToPlayer > stopRange) {
      this.pos.x += this.facingright ? this.speed : -this.speed;
    }

    // shoot while see the player
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
    } else {
      this.fire();
      this.fireCooldown = 40;
    }

  } else {
    //  patrolling when the player is out of sight
    this.pos.x += this.facingright ? this.speed : -this.speed;
  }

  // update the bullets
  for (let i = this.bullets.length - 1; i >= 0; i--) {
    let b = this.bullets[i];
    b.update();

    let hit = dist(b.pos.x, b.pos.y, player.pos.x, player.pos.y) < 30;
    if (hit) {
      let damage = b.damage || floor(random(6, 13));
      player.health -= damage;
      this.bullets.splice(i, 1);
      continue;
    }

    if (b.offscreen()) {
      this.bullets.splice(i, 1);
    }
  }
}


  fire() {
    let fireY = this.pos.y - this.height / 2 + this.height * 0.25;
    let fireX = this.pos.x + (this.facingright ? this.width * 0.25 : -this.width * 0.25);
    
    let dir = createVector(this.facingright ? 1 : -1, 0);
    let damage = floor(random(6, 13));

    this.bullets.push(new EnemyBullet(fireX, fireY, dir, damage));
  }

  show() {
    push(); //The transformation after the push operation will not affect other graphic objects.
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    if (this.facingright) scale(-1, 1);
    image(this.img, 0, 0, this.width, this.height);
    pop();

    for (let b of this.bullets) {
      b.show();
    }
  }

  // check if shoot the player
  isHit(bullet) {
    return (
      bullet.pos.x > this.pos.x - this.width / 2 &&
      bullet.pos.x < this.pos.x + this.width / 2 &&
      bullet.pos.y > this.pos.y - this.height / 2 &&
      bullet.pos.y < this.pos.y + this.height / 2
    );
  }
  hit(dmg) {
    this.health -= dmg;
  }
  isDead() {
    return this.health <= 0;
  }
}