/*******************************************************************
@file BossEnemy.js
@description This file is the BossEnemy class, kill the boss enemy to win
@author George Zhou
@version 1.5.0
@date [2025-06-08]
*******************************************************************/

class BossEnemy {
constructor(x, y, img, scale = 0.7) {
  this.img = img;
  this.scale = scale;

  this.originalW = img.width;
  this.originalH = img.height;
  this.width = this.originalW * this.scale;
  this.height = this.originalH * this.scale;

  this.pos = createVector(x, y);

  this.health = 3600;
  this.maxHealth = 3600;

  this.facingRight = true;
  this.bullets = [];

  this.fireCooldown = 0;
  this.attackRange = 900;

  this.isattacking = false; 
  this.attackStart = millis(); 

  this.fireInterval = 10;
}

update() {
  // turn to right or left depend player
  if (player.pos.x > this.pos.x) {
    this.facingRight = true;
  } else {
    this.facingRight = false;
  }

  let t = millis();
  if (this.isattacking === true) {
    if (t - this.attackStart > 5000) {
      this.isattacking = false;
      this.attackStart = t;
    }
  } else {
    if (t - this.attackStart > 2000) {
      this.isattacking = true;
      this.attackStart = t;
    }
  }

  // fire logic missed before, now add
  let dx = player.pos.x - this.pos.x;
  let dy = player.pos.y - this.pos.y;
  let distance = sqrt(dx * dx + dy * dy);
  if (this.isattacking === true && distance < this.attackRange) {
    if (this.fireCooldown <= 0) {
      this.fire();
      this.fireCooldown = this.fireInterval;
    } else {
      this.fireCooldown--;
    }
  }

  for (let i = this.bullets.length - 1; i >= 0; i--) {
    let b = this.bullets[i];
    b.update();

    let hit = dist(b.pos.x, b.pos.y, player.pos.x, player.pos.y) < 30;
    if (hit) {
      let damage = b.damage || floor(random(8, 16));
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
    let fireX;
    if (this.facingRight == true) {
      let offsetX = this.width * 2 / 7;
      fireX = this.pos.x + offsetX;
    } else {
      let offsetX = this.width * 2 / 7;
      fireX = this.pos.x - offsetX - 12;
    }

    let fireY;
    fireY = this.pos.y - 36; //ensure the location the bullet fire from the gun

    // find where is the player to shoot
    let dx = player.pos.x - fireX;
    let dy = player.pos.y - fireY;

    // get the distance find the lcation
    let dxSquared = dx * dx;
    let dySquared = dy * dy;
    let sum = dxSquared + dySquared;
    let magnitude = sqrt(sum);


    let dir;
      if (magnitude !== 0) {
        dir = createVector(dx / magnitude, dy / magnitude);
      } else {
        dir = createVector(0, 0); 
      }
    let damage = floor(random(8, 16));

    this.bullets.push(new EnemyBullet(fireX, fireY, dir, damage));
  }

  show() {
    push();// The transformation after the push operation will not affect other graphic objects.
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    if (this.facingRight) scale(-1, 1);
    image(this.img, 0, 0, this.width, this.height);
    pop();

    for (let b of this.bullets) {
      b.show();
    }
  }

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
