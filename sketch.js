// ======================================
// PORTAL TEST CHAMBER FIGHTER (POLISHED)
// ======================================

let gameState = "start";

let p1, p2;
let flashTimer = 0;
let winner = "";

const tileSize = 50;
const gravity = 0.8;
const jumpForce = -15;

// ---- SOUND ----
let hitSound;
let startSound;
let winSound;

// ---------------- LOAD SOUNDS ----------------
function preload() {
  hitSound = loadSound("assets/hit.mp3");
  startSound = loadSound("assets/start.mp3");
  winSound = loadSound("assets/win.mp3");
}

// ---------------- SETUP ----------------
function setup() {
  createCanvas(windowWidth, windowHeight);

  p1 = { x: 160, y: height - 200, vy: 0, grounded: true, hp: 100 };
  p2 = { x: width - 200, y: height - 200, vy: 0, grounded: true, hp: 100 };
}

// ---------------- DRAW ----------------
function draw() {
  if (gameState === "start") drawStart();
  else if (gameState === "fight") drawFight();
  else if (gameState === "end") drawEnd();
}

// ---------------- START ----------------
function drawStart() {
  background(230);

  noFill();
  strokeWeight(8);

  stroke(0, 120, 255);
  ellipse(width * 0.3, height / 2, 150);

  stroke(255, 140, 0);
  ellipse(width * 0.7, height / 2, 150);

  noStroke();

  fill(50);
  textAlign(CENTER, CENTER);

  textSize(36);
  text("PORTAL COMBAT TEST", width / 2, height * 0.3);

  textSize(16);
  text(
    "ENTER to start | A/D/W + F (Player A) | Arrows + K (Player B)",
    width / 2,
    height * 0.65
  );
}

// ---------------- FIGHT ----------------
function drawFight() {
  background(220);

  // ---- TILE WALLS ----
  for (let x = 0; x < width; x += tileSize) {
    for (let y = 0; y < height; y += tileSize) {

      if ((x + y) % (tileSize * 2) === 0) fill(240);
      else fill(220);

      stroke(200);
      rect(x, y, tileSize, tileSize);
    }
  }

  noStroke();

  let floorY = height - 150;

  // ---- FLOOR ----
  for (let x = 0; x < width; x += tileSize) {
    for (let y = floorY; y < height; y += tileSize) {
      fill(180);
      stroke(150);
      rect(x, y, tileSize, tileSize);
    }
  }

  noStroke();

  // ---- PORTALS ----
  noFill();
  strokeWeight(6);

  stroke(0, 120, 255);
  ellipse(width * 0.25, height * 0.4, 70);

  stroke(255, 140, 0);
  ellipse(width * 0.75, height * 0.4, 70);

  noStroke();

  // ---- PHYSICS ----
  updatePlayer(p1, floorY);
  updatePlayer(p2, floorY);

  // ---- MOVEMENT CLAMP ----
  p1.x = constrain(p1.x, 0, width - 40);
  p2.x = constrain(p2.x, 0, width - 40);

  // ---- PLAYERS ----
  fill(0, 120, 255);
  rect(p1.x, p1.y, 40, 50);

  fill(255, 140, 0);
  rect(p2.x, p2.y, 40, 50);

  // ---- UI ----
  fill(50);
  textSize(16);

  textAlign(LEFT);
  text("Subject A: " + p1.hp, 20, 30);

  textAlign(RIGHT);
  text("Subject B: " + p2.hp, width - 20, 30);

  // ---- FLASH ----
  if (flashTimer > 0) {
    fill(255, 120);
    rect(0, 0, width, height);
    flashTimer--;
  }

  // ---- WIN CONDITION ----
  if (p1.hp <= 0 || p2.hp <= 0) {
    if (p1.hp <= 0) winner = "Subject B Wins";
    else winner = "Subject A Wins";

    winSound.play();
    gameState = "end";
  }
}

// ---------------- END ----------------
function drawEnd() {
  background(50);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(32);
  text(winner, width / 2, height / 2);

  textSize(18);
  text("Press ENTER to restart", width / 2, height / 2 + 50);
}

// ---------------- PHYSICS ----------------
function updatePlayer(p, floorY) {
  p.vy += gravity;
  p.y += p.vy;

  if (p.y >= floorY - 50) {
    p.y = floorY - 50;
    p.vy = 0;
    p.grounded = true;
  } else {
    p.grounded = false;
  }
}

// ---------------- INPUT ----------------
function keyPressed() {

  // START
  if (gameState === "start" && keyCode === ENTER) {
    startSound.play();
    gameState = "fight";
  }

  // RESTART
  else if (gameState === "end" && keyCode === ENTER) {
    p1.hp = 100;
    p2.hp = 100;
    gameState = "fight";
  }

  if (gameState === "fight") {

    // Player A
    if (key === 'a') p1.x -= 20;
    if (key === 'd') p1.x += 20;
    if ((key === 'w' || key === 'W') && p1.grounded) p1.vy = jumpForce;
    if (key === 'f') {
      p2.hp -= 10;
      flashTimer = 5;
      hitSound.play();
    }

    // Player B
    if (keyCode === LEFT_ARROW) p2.x -= 20;
    if (keyCode === RIGHT_ARROW) p2.x += 20;
    if (keyCode === UP_ARROW && p2.grounded) p2.vy = jumpForce;
    if (key === 'k') {
      p1.hp -= 10;
      flashTimer = 5;
      hitSound.play();
    }
  }
}

// ---------------- RESIZE ----------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  p1.y = height - 200;
  p2.y = height - 200;
}
