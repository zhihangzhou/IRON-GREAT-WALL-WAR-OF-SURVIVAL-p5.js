/*******************************************************************
@file Player.js
@description This file is the Player class, which controls the player's movement, shooting, health, death.
@author George Zhou
@version 2.6.0
@date 2025-06-08
*******************************************************************/
// Leadning this use the Pythagorean theorem control direction of magnutite from thiswebsite. Tould me how to change the distance to an magneutite
//http://www.webgl3d.cn/pages/d69d76/

// shooting speed control by the firecool down
//learn from here: https://frankgwarman.medium.com/creating-a-shooting-cooldown-system-3ad546ceb971

let basescale = 0.18; 
let bodyscale = 0.12;
class Player {
  constructor(x, y, clipSize = 36, totalAmmo = 360) {
    this.pos = createVector(x, y);
    this.angle = 0; 
    this.clipSize = clipSize;  
    this.currentClip = clipSize; 
    this.totalAmmo = totalAmmo; 
    this.isReloading = false;  
    this.reloadStartTime = 0;  
    this.reloadDuration = 1500; 
    this.maxHealth = 300; 
    this.health = 300; 
    this.speed = 3;
    this.lastHealth = 300;  
    this.lastHealthChangeTime = 0; 
    this.lastRegenTime = 0;
  }

  update() {
  // A left
  if (keyIsDown(65)) {
    if (this.pos.x > 12) {
      this.pos.x = this.pos.x - this.speed;
    }
  }

  // D right
  if (keyIsDown(68)) {
    if (this.pos.x < 1333) {
      this.pos.x = this.pos.x + this.speed;
    }
  }

  // W up
  if (keyIsDown(87)) {
    if (this.pos.y > 630) {
      this.pos.y = this.pos.y - this.speed;
    }
  }

  // S down
  if (keyIsDown(83)) {
    if (this.pos.y < 825) {
      this.pos.y = this.pos.y + this.speed;
      }
    }
  }

//When rotates the mouse by more than ninety degrees, they will turn around.
  show() {
    let dx = mouseX - this.pos.x;
    let dy = mouseY - this.pos.y;
    this.angle = atan2(dy, dx); 
    let facingleft = keyIsDown(65);
    let facingright = keyIsDown(68);
    push();//The transformation after the push operation will not affect other graphic objects.
    translate(this.pos.x, this.pos.y);
    imageMode(CENTER); 
    
    
 //  car
    push();
    if (facingleft) {
      scale(-basescale, basescale); 
    } else {
      scale(basescale);
    }
    image(playerBaseImage, 30, 0); 
    pop();

    push();
 // move the body on the car
    let offsetY = -playerBaseImage.height * basescale * 0.2 + 2;
    translate(0, offsetY); 

    rotate(this.angle); // face the mouse 

 // If the mouse is to the left, flip the image up and down
    if (cos(this.angle) < 0) {
      scale(1, -1); 
    }

    scale(bodyscale); 
    image(playerBodyImage, 0, 0); 
    pop();

    pop(); 
  }

shoot() {
  if (this.currentClip > 0 && !this.isReloading) {
    this.currentClip--;

    // get player's posision 
    let offsetY = -playerBaseImage.height * basescale * 0.2; 
    let centerX = this.pos.x;
    let centerY = this.pos.y + offsetY;

    let dx = mouseX - centerX;
    let dy = mouseY - centerY;
    // Calculate the length using the Pythagorean theorem, that is, the distance between two points 
    // This length is used to standardize the direction vector. The actual trajectory length is not important; I only need to ensure the direction is facing the mouse click posision
    let length = sqrt(dx * dx + dy * dy);

    // By dividing by the length, adjust the vector length to 1, retain only the direction information, and ensure that the trajectory direction is correctly oriented towards the mouse click position
    let dirX = dx / length;
    let dirY = dy / length;

    // define the spped  of the bullet
    let bulletSpeed = 6;
    let velX = dirX * bulletSpeed;
    let velY = dirY * bulletSpeed;
    let dir = createVector(velX, velY);

    // fron the ahead of the player to shoot
    let shootOffset = 30 * bodyscale;
    let startX = centerX + dirX * shootOffset;
    let startY = centerY + dirY * shootOffset;

    return new Bullet(startX, startY, dir);
  }

  // refill the clip
  if (this.currentClip === 0 && !this.isReloading) {
    this.startReloading();
  }

  return null;
}

  startReloading() {
    if (!this.isReloading && this.totalAmmo > 0) {
      this.isReloading = true;
      this.reloadStartTime = millis(); 
    }
  }
reload() {
  // check if it is alreading refill the bullete
  if (this.isReloading) {
    return;
  }
  // if it is already 0 which it will start refill
  if (this.totalAmmo <= 0) {
    return;
  }

  // if it is full then we don't need
  if (this.currentClip === this.clipSize) {
    return;
  }

  // if all does not happen then refill
  this.isReloading = true;

  // record the time it fill to check let it stop in the time I give
  this.reloadStartTime = millis();
}

autoRegen() {
  let currentTime = millis(); 

  // check if be hurt the health is lesser
  if (this.health < this.lastHealth) {
    this.lastHealthChangeTime = currentTime;
  }

  // update the health
  this.lastHealth = this.health;

  // stop while blood is full
  if (this.health >= this.maxHealth) {
    return;
  }

  let timeSinceHurt = currentTime - this.lastHealthChangeTime;
  let timeSinceRegen = currentTime - this.lastRegenTime;

  if (timeSinceHurt >= 2000 && timeSinceRegen >= 500) {
    // random 6 - 12
    let randomValue = random(6, 13); 
    let regenAmount = floor(randomValue); // only can be full number, last time it has a lot point number

    this.health = this.health + regenAmount;

    // because it is random number increase, so I must include this
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }

    // update last regen time
    this.lastRegenTime = currentTime;
    }
  }
}