/*******************************************************************
@file Gun.js
@description This file gives the Gun class, orginally for test and not show in the class of player
@author George Zhou
@version 1.2.0
@date 2025-06-08

*******************************************************************/

// Originally I want to have different kind of guns let the player have, but I finally give up this idea
class Gun {
  constructor(owner) {
    this.owner = owner;     
    this.cooldown = 200; 
    this.lastShot = 0;
  }
}

