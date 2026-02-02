/*************************************************************************
Capstone project
Name:George Zhou
Date:2025/4/18
Class:CS30
****************************************************************************/

// AI picture tool I used
//https://jimeng.jianying.com/ai-tool/image-edit/d4c6e732ab324196b69d5e605dc4ddb2?workspaceId=7495277151961235510

//the video about time set up like count down, some basic agorusim
// https://www.youtube.com/watch?v=HssgJacSKvA

// some knowledge about press mourse to shoot push the bullet to shoot
//https://www.youtube.com/watch?v=GusFmfBmJmc

// learn that I could transfer to different screen to make the game by define different state
// from here https://zhuanlan.zhihu.com/p/648288770

// endure the key's number espically in player's control's keydown("") 
//https://www.toptal.com/developers/keycode

// player
let player; 
let playerIsDead = false; // check if player died
let playerDeathTime = 0;  // the time player is died
let lifeDeducted = false;

// images
let backgroundImage; // background 
let spawnImage;  // plays 
let logoImage; // log
let explosionImage;  // Explosion when dead

let scaleFactor = 0.46;  // scale for the spawn point
let alphaValue = 255;  // alpha value for the spawn point

let gameState = 'intro_logo';  // primary game stae
let logoX = -300;  // logo's primary x 
let promptAlpha = 0; 
let showInstruction = false; // when shows the instrucation

// Shooting
let bullets = [];  // bullet
let lastShotTime = 0;  
let shootCooldown = 200; // shooting cooldown (ms)
let clipSize = 36; // bullets speed
let totalAmmo = 360; // total reserve ammo
let currentClip = clipSize;  // current bullets left
let isReloading = false; // check is reloading
let reloadStartTime = 0; // reload start time
let reloadDuration = 1500; // reload time (1.5 seconds)

// Units (feature scrapped)
let units = [];  // friendly unit names
let allies = [];
let unitImages = []; // friendly unit images
let enemies = [];  // enemy units
let enemyImages = [];  // enemy unit images

let lastEnemySpawnTime = 0;  // last enemy spawn time
let enemySpawnInterval = 3000; // enemy spawn interval 
let minEnemySpacing = 8 * 50;  // minimum space between enemies (pixels)

let deathAnimations = [];  // death animations

let gamePaused = false;

// let commandPanel = new CommandPanel(); give up idea

let kills = 0;  // current kill number
let playerLives = 3;  // player lives (set by difficulty)
let killTarget = 20;  // kills target for fun


let gameOverCountdown = 5; // time for count down
let continueStartTime = 0; 
let hasContinued = false;  //if player choose to contune the game

let winStartTime = 0;   
let winDuration = 4000;    //how long this page being keep
let readyToContinue = false; // check to jump to next page

let loseStartTime = 0;
let loseDuration = 3000; // show three second

let previousState = '';   // Record the status before inserting coins


function drawGameLose() {
  if (loseStartTime === 0) {
    loseStartTime = millis();
  }
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("YOU LOSE!", width / 2, height / 2 - 40);

  textSize(24);
  text("Try again by inserting coin...", width / 2, height / 2 + 40);

  if (millis() - loseStartTime >= loseDuration) {
    gameState = 'continue_prompt';
    continueStartTime = millis();
  }
}

function checkGameOver() {
  if (playerLives <= 0 && gameState !== 'game_lose') {
    playerLives = 0;
    previousState = gameState;  
    gameState = 'game_lose'; 
    loseStartTime = millis();
    hasContinued = false;
  }
}

// Coin-operated interface: Inspired by classic old-fashioned arcade games, it decides whether to continue reviving or restart the game based on the source of the final victory or defeat
function drawContinuePrompt() {
  background(0, 180);
  textAlign(CENTER, CENTER);

  let coinX = width / 2;
  let coinY = height / 2 - 120;
  let coinR = 40;

  fill(255, 215, 0);
  ellipse(coinX, coinY, coinR * 2);
  fill(0);
  textSize(28);
  text("$", coinX, coinY);

  fill(255);
  textSize(36);
  text("INSERT COIN TO CONTINUE \n PRESS SPACE \n", width / 2, height / 2 + 10);

  let timePassed = floor((millis() - continueStartTime) / 1000);
  let timeLeft = max(0, gameOverCountdown - timePassed);
  textSize(24);
  text("Time Left: " + timeLeft + "s", width / 2, height / 2 + 60);

  if (timeLeft <= 0 && !hasContinued) {
    gameState = 'game_thanks';
  }
  if (keyIsDown(32) && !hasContinued) {
    hasContinued = true; 
    if (previousState === 'game_lose') {
      continueGame();  // reborn
    } else if (previousState === 'game_win') {
      resetGame(); // restart the game
    }
  }
}

// FINAL PAGE SOME SPCIAL THANKS FOR IDEAS AND PICTURE COMFROM
function drawGameThanks() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("GAME OVER", width / 2, height / 2 - 80);

  textSize(24);
  text("Special Thanks", width / 2, height / 2 - 20);

  textSize(20);
  text("@司空子衡 (bilibili)\n", width / 2, height / 2 + 40);
  text("Commando 2: Battle of Asia\n", width / 2, height / 2 + 120);
}

// reset everything
function resetGame() {
  playerLives = 3;
  kills = 0;
  bullets = [];
  enemies = [];
  boss.health = boss.maxHealth;
  winStartTime = 0;
  playerIsDead = false;   
  winStartTime = 0; // Allow the win page animation to be displayed again in the next round
  continueStartTime = 0; 
  loseStartTime = 0;
  readyToContinue = false;
  hasContinued = false; 
  previousState = ''; 
  gameState = 'difficulty_select';
}

// victory page
function drawGameWin() {
  if (winStartTime === 0) {
    winStartTime = millis(); 
  }
  previousState = gameState; 
  gameState = 'game_win';
  background(0);
  textAlign(CENTER, CENTER);
  textSize(48);
  fill(255, 215, 0);
  text(" YOU WIN! ", width / 2, height / 2 - 40);

  fill(255);
  for (let i = 0; i < 50; i++) {
    ellipse(random(width), random(height), random(2, 5));
  }

  if (millis() - winStartTime >= winDuration) {
    gameState = 'continue_prompt';
    continueStartTime = millis();
    readyToContinue = true;
  }
}

function continueGame() {
  playerLives = 1;
  player.health = player.maxHealth;
  playerIsDead = false;
  bullets = [];
  gameState = 'gameplay';
}

function preload() {
  // basic 
  backgroundImage = loadImage('初始背景.jpg');
  spawnImage = loadImage('建筑-出生点.png');
  logoImage = loadImage('logo.jpg');
  explosionImage = loadImage('爆炸效果.png');

  //player
  playerBaseImage = loadImage('主角汽车.png');
  playerBodyImage = loadImage('主角汽车上半身.png');

  // allies give up idea

  // ememies 
  enemyImages.push(loadImage('机枪汽车.png')); 
  bossImage = loadImage('敌方基地.png')
}


//  set up
function setup() {
  createCanvas(960, 600); 
  player = new Player(200, 625); 
  boss = new BossEnemy(width + bossImage.width * 0.7/2 + 120, height + bossImage.height * 0.7/2, bossImage ); // right botttom

  //panel = new CommandPanel(); give up idea

}

function draw() {
  if (gamePaused) {
    drawPauseScreen(); 
    return;
  }

  if (gameState === 'intro_logo') {
    drawLogoScene(); 
  } else if (gameState === 'difficulty_select') {
    drawDifficultySelect();
  } else if (gameState === 'playing') {
    drawGameplay();  
  } else if (gameState === 'continue_prompt') {
    drawContinuePrompt();
  } else if (gameState === 'game_thanks') {
    drawGameThanks();
  } else if (gameState === 'game_win') {
    drawGameWin();
  } else if (gameState === 'game_lose') {
    drawGameLose(); 
  }
}

// way to pause the game
function drawPauseScreen() {
  background(0, 0, 0, 180);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Game Paused\nPress P to resume", width / 2, height / 2);
}


function applyDifficultySettings() {
  if (selectedDifficulty === 'easy') {
    enemySpawnInterval = 2000; // speed of ememies come
    minEnemySpacing = 7 * 50;  //distance between ememies
    enemySpeed = 1.0; // speed
    enemyHealthMultiplier = 0.8; // blood of ememies
    killTarget = 15; // goal of kill
    playerLives = 5; // lives of player
  } else if (selectedDifficulty === 'normal') {
    enemySpawnInterval = 1000;
    minEnemySpacing = 6 * 50;
    enemySpeed = 1.4;
    enemyHealthMultiplier = 1.0;
    killTarget = 25;
    playerLives = 3;
  } else if (selectedDifficulty === 'hard') {
    enemySpawnInterval = 300; 
    minEnemySpacing = 2 * 50;
    enemySpeed = 1.8;
    enemyHealthMultiplier = 1.8;
    killTarget = 40;
    playerLives = 2;
  }
}
 
function drawBossHealthBar() {
  let barWidth = 200;
  let barHeight = 25;
  let x = width - barWidth - 20;  // up right
  let y = 280;
  fill(255);
  rect(x, y, barWidth, barHeight);
  fill(200, 0, 0);
  boss.health = max(0, boss.health);
  let bossHealthWidth = map(boss.health, 0, boss.maxHealth, 0, barWidth);
  rect(x, y, bossHealthWidth, barHeight);

  fill(0);
  textSize(18);
  textAlign(RIGHT, CENTER);
  text(boss.health + "/" + boss.maxHealth, x + barWidth, y - 12);
}



function drawDifficultyHUD() {
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Difficulty: ${selectedDifficulty.toUpperCase()}`, 10, 10);
  text(`Lives: ${playerLives}`, 10, 30);
  text(`Kills: ${kills} / ${killTarget}`, 10, 50);
  if (gamePaused) {
    text("Status: PAUSED", 10, 70);
  }
}


//  logo page
function drawLogoScene() {
  background(12);  
  logoX += 10; // logo from left comes to the sreen
  let targetX = width / 2 - logoImage.width / 2;
  if (logoX > targetX) logoX = targetX;
  image(logoImage, logoX, height / 2 - logoImage.height / 2);  // show

  // show the words
  if (logoX === targetX) {
    promptAlpha += 5;
    if (promptAlpha > 255) promptAlpha = 255;

    fill(255, promptAlpha);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Press f to see the full screen", width / 2, height - 90);
    text("Press SPACE to start", width / 2, height - 60);
    text("[Click Here for Instructions]", width / 2, height - 30);
    if (showInstruction) drawInstructions(); 
  }
}

function drawDifficultySelect() {
  background(20);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Select Difficulty", width / 2, height / 2 - 100);

  textSize(28);
  text("Press 1：Easy", width / 2, height / 2 - 30);
  text("Press 2：Normal", width / 2, height / 2 + 30);
  text("Press 3：Hard", width / 2, height / 2 + 90);
}

function drawInstructions() {
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text("WASD to move，press key to shoot，R fill the bullet\nThe mouse controls the orientation of the player\n Press P to pause/unpause\nAmmo refills at spawn point\nDefeat the boss to win the game\nFail when used all of the lives", width / 2, height / 2 + 250);
}
let gameplayStartTime;

function drawGameplay() {
  background(255, 102, 53);
  image(backgroundImage, 0, 0, width, height);
  push();
  scale(scaleFactor);
  tint(255, alphaValue - 66);
  image(spawnImage, 0, height * 1.2);
  pop();
  
  if (boss && !boss.isDead()) {
    boss.update();
    boss.show();
  if (boss && boss.isDead() && gameState === 'playing') {
    gameState = 'game_win';
    winStartTime = 0;
  }
}

  //commandPanel.update();
  //commandPanel.drawPanel();

  //for (let unit of allyUnits) {
  //  unit.update();
  //}
  if (!gameplayStartTime) gameplayStartTime = millis();

  // show the player
  if (!playerIsDead) {
    player.update();
    player.show();
    player.autoRegen();
  }

  // creat enemies
  spawnEnemies();
  for (let e of enemies) {
    e.update();
    e.show();
  }

  // fill the bullets
  let spawnX = 195, spawnY = 621, range = 50;
  if (
    player.pos.x > spawnX - range && player.pos.x < spawnX + range &&
    player.pos.y > spawnY - range && player.pos.y < spawnY + range
  ) {
    player.totalAmmo = 360;
    fill(255, 255, 0);
    textAlign(CENTER);
    textSize(20);
    text("The ammunition has been replenished", width / 2, height - 50);
  }

// player shooting
let currentTime = millis();
if (mouseIsPressed) {
  if (!player.isReloading && !playerIsDead) {
    let timeSinceLastShot = currentTime - lastShotTime;

    if (timeSinceLastShot >= shootCooldown) {
      let bullet = player.shoot();

      if (bullet !== null) {
        bullets.push(bullet);
        lastShotTime = currentTime;
      }
    }
  }
}

//check
for (let i = bullets.length - 1; i >= 0; i--) {
  let b = bullets[i];
  b.update();
  b.show();

  let hitEnemy = false;
//when hit simple emeies
  for (let j = enemies.length - 1; j >= 0; j--) {
    let enemy = enemies[j];
    if (enemy.isHit(b)) {
      let damage = floor(random(36, 55));
      enemy.hit(damage);
      hitEnemy = true;
      if (enemy.isDead()) {
        kills++;
        deathAnimations.push(new DeathAnimation(enemy.pos.x, enemy.pos.y, explosionImage, false));
        enemies.splice(j, 1);
      }
      break;
    }
  }
  //shoot boss
  if ( !boss.isDead() && boss.isHit(b)) {
    let damage = floor(random(36, 55));
    boss.hit(damage);
    hitEnemy = true;
    if (boss.isDead()) {
      gameState = 'game_win';
      deathAnimations.push(new DeathAnimation(boss.pos.x, boss.pos.y, explosionImage, false));
  //
    }
  }
  if (hitEnemy || b.offscreen()) {
    bullets.splice(i, 1);
  }
}


// check player dies
  if (player.health <= 0 && !playerIsDead) {
    player.health = 0; 
    playerIsDead = true;
    playerDeathTime = millis();
    deathAnimations.push(new DeathAnimation(player.pos.x, player.pos.y, explosionImage, true));
    return
  }
  if (player.isReloading && currentTime - player.reloadStartTime >= player.reloadDuration) {
    let refill = min(player.clipSize, player.totalAmmo);
    player.currentClip = refill;
    player.totalAmmo -= refill;
    player.isReloading = false;
  }
// death aminantion for player
  for (let i = deathAnimations.length - 1; i >= 0; i--) {
    let anim = deathAnimations[i];
    anim.show();
    if (!anim.update()) {
      deathAnimations.splice(i, 1);
    }
  }
    
  //for (let unit of allyUnits) {
  //  unit.update();
  //  unit.show();
  //}
  //commandPanel.update();
  //commandPanel.drawPanel();
  drawHUD();
  drawDifficultyHUD()
  drawBossHealthBar();

  if (playerIsDead) {
    if (playerIsDead && !lifeDeducted) {
      playerLives--;
      lifeDeducted = true; 
      checkGameOver();  
    }

    let timeSinceDeath = millis() - playerDeathTime;
    let countdown = 5 - floor(timeSinceDeath / 1000);

//death page for player
    push();
    fill(255, 0, 0, 80);
    rect(0, 0, width, height);
    pop();

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("You are died after，" + countdown + " second reborn", width / 2, height / 2);

    if (timeSinceDeath >= 5000) {
      playerIsDead = false;
      lifeDeducted = false; 
      player.health = player.maxHealth;
      player.pos.set(spawnX, spawnY);
      player.currentClip = player.clipSize;
      player.totalAmmo = 360;
      bullets = [];
    }
  }
}

//  HUD for health bar and number bullet left
function drawHUD() {
  let offsetY = 90; 

  fill(255);
  rect(20, offsetY + 60, 200, 25); 
  fill(200, 0, 0);
  player.health = max(0, player.health);  // can not less than 0
  let healthBarWidth = map(player.health, 0, player.maxHealth, 0, 200);
  rect(20, offsetY + 60, healthBarWidth, 25); 

  fill(0);
  textSize(18);
  textAlign(LEFT, CENTER);
  text(player.health + "/" + player.maxHealth, 20, offsetY + 48); // blood
  text(player.currentClip + "/" + player.totalAmmo, 20, offsetY + 30);  // bullets

  if (player.isReloading) {
    text("Reloading...", 140, offsetY + 30);
  } else if (player.currentClip === 0 && player.totalAmmo === 0) {
    text("Out of Ammo!", 140, offsetY + 30);
  }
}


function spawnEnemies() {
  let now = millis();
  if (now - lastEnemySpawnTime > enemySpawnInterval) {
    let spawnX = (1500);
    let spawnY = random(620, 825);

    let tooClose = false;
    for (let e of enemies) {
      if (abs(e.pos.x - spawnX) < minEnemySpacing) {
        tooClose = true;
        break;
      }
    }
    if (!tooClose) {
      let enemyImg = enemyImages[0]; 
      let scale = 0.36;  
      enemies.push(new GunTruckEnemy(spawnX, spawnY, enemyImg, scale));
      lastEnemySpawnTime = now; 
    }
  }
}

/*******************************************************
function summonUnit(name) {
  if (name === "MotorcycleAlly") {
    let y = random(620, 825);

    let targetEnemy;

    if (enemies.length > 0) {
      targetEnemy = enemies[0];
    } else {
      targetEnemy = null;
    }

    let unit = new MotorcycleAlly(0, y, unitImages[0], targetEnemy, 0.36);
    allyUnits.push(unit);
  } else {
    console.warn(name);
  }
}
*******************************************************/


function keyPressed() {
  if (key === 'f' || key === 'F') fullscreen(!fullscreen()); // full screen
  
  if (key === 'p' || key === 'P') {
    if (gameState === 'playing') {
      gamePaused = !gamePaused;
    }
  }//pause
  
  if (gameState === 'intro_logo' && key === ' ') {
    gameState = 'difficulty_select'; // start the game
  }

  if (gameState === 'difficulty_select') {
    if (key === '1') {
      selectedDifficulty = 'easy';
      applyDifficultySettings();
      gameState = 'playing';
    } else if (key === '2') {
      selectedDifficulty = 'normal';
      applyDifficultySettings();
      gameState = 'playing';
    } else if (key === '3') {
      selectedDifficulty = 'hard';
      applyDifficultySettings();
      gameState = 'playing';
    }
  }//game diffuculty


  if ((gameState === 'game_thanks' || gameState === 'game_win') && key === 'r' || key === 'R') {
    resetGame();
  }

  if (key === 'r' || key === 'R') {
    player.reload(); // refuse the bullets
  }
  if (gameState === 'continue_prompt' && !hasContinued) {
  if (key === ' ') {
    hasContinued = true;
    resetGame();
  }
}

  //if (key === ' ') {
  //commandPanel.recruitFormation();
  //}
}

function mousePressed() {
  if (gameState === 'intro_logo') {
    textSize(24);
    let textStr = "[Click Here for Instructions]";

    if (typeof textStr === 'string') {
      let textW = textWidth(textStr);
      let textH = 30;

      let cx = width / 2;
      let cy = height - 30;

      let x1 = cx - textW / 2;
      let x2 = cx + textW / 2;
      let y1 = cy - textH / 2;
      let y2 = cy + textH / 2;


      if (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2) {
        showInstruction = !showInstruction;
      }
    }
  }
}



//function mouseClicked() {
//  console.log(mouseX, mouseY);
//}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}