/*******************************************************************
@file DeathAnimation.js
@description This file is the DeathAnimation class, which is the animation of dead characters: player and enemy. 
@author George Zhou
@version 1.2.0
@date 2025-06-08
*******************************************************************/

class DeathAnimation {
  constructor(x, y, img, isPlayer) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.isPlayer = isPlayer;
    this.startTime = millis();
    this.duration = 1000; // 1 second
    this.alpha = 255;
  }

  update() {
    let elapsed = millis() - this.startTime;
    this.alpha = map(elapsed, 0, this.duration, 255, 0);
    return elapsed < this.duration;
  }

  show() {
    push(); //The transformation after the push operation will not affect other graphic objects.
    tint(255, this.alpha * (frameCount % 10 < 5 ? 1 : 0.6));  // shineing
    imageMode(CENTER);
    let scaleFactor = this.isPlayer;
    image(this.img, this.x, this.y, this.img.width * scaleFactor, this.img.height * scaleFactor);
    pop();
  }
}

