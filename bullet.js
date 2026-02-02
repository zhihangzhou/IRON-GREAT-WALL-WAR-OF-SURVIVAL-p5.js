/*******************************************************************
@file Bullet.js
@description This file is the Bullet class, is bullets fired by the player. 
@author George Zhou
@version 1.2.0
@date[2025-06-08
*******************************************************************/

class Bullet {
  constructor(x, y, velocity) {
    this.pos = createVector(x, y);
    this.vel = velocity.copy(); 
    this.size = 5;
  }

  update() {
    this.pos.add(this.vel);
  }

  show() {
    push(); //The transformation after the push operation will not affect other graphic objects.
    stroke(255, 255, 0);
    strokeWeight(4);
    line(
      this.pos.x,
      this.pos.y,
      this.pos.x - this.vel.x * 0.5,
      this.pos.y - this.vel.y * 0.5
    );
    pop();
  }

  offscreen() {
    return (
      this.pos.x < 0 || this.pos.x > width ||
      this.pos.y < 0 || this.pos.y > height
    );
  }
}
