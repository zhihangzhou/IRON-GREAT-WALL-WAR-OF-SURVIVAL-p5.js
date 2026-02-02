/*******************************************************************
@file EnemyBullet.js
@description This file is the EnemyBullet class, which represents bullets fired by enemy units such as GunTruckEnemy and the boss. 
@author George Zhou
@version 1.2.0
@date 2025-06-08
*******************************************************************/

class EnemyBullet {
  constructor(x, y, dir) {
    this.pos = createVector(x, y);
    this.vel = dir.copy().setMag(6);
    this.size = 8;
  }

  update() {
    this.pos.add(this.vel);
  }

  show() {
    push(); //The transformation after the push operation will not affect other graphic objects.
    fill(255, 235, 64);
    stroke(230, 24, 26);
    ellipse(this.pos.x, this.pos.y, this.size);
    pop();
  }

  offscreen() {
    return (
      this.pos.x < 0 || this.pos.x > width ||
      this.pos.y < 0 || this.pos.y > height
    );
  }
}
