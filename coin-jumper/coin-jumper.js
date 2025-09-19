// Coin Jumper MVP (Jetpack Joyride inspired)
const canvas = document.getElementById('coinJumperCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let player = { x: 60, y: 380, w: 32, h: 32, vy: 0, onGround: false };
let coins = [];
let obstacles = [];
let enemies = [];
let score = 0;
let gameOver = false;
let gravity = 0.7;
let scrollSpeed = 3;

canvas.addEventListener('touchstart', function() {
  if (gameOver) return;
  if (player.onGround) player.vy = -12;
});

function spawnCoin() {
  coins.push({ x: canvas.width, y: Math.random() * 300 + 100, r: 12 });
}
function spawnObstacle() {
  obstacles.push({ x: canvas.width, y: 420, w: 40, h: 20 });
}
function spawnEnemy() {
  enemies.push({ x: canvas.width, y: Math.random() * 300 + 100, w: 32, h: 32 });
}

function drawPlayer() {
  ctx.fillStyle = '#ff0';
  ctx.fillRect(player.x, player.y, player.w, player.h);
}
function drawCoins() {
  ctx.fillStyle = '#ffd700';
  coins.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
  });
}
function drawObstacles() {
  ctx.fillStyle = '#888';
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));
}
function drawEnemies() {
  ctx.fillStyle = '#f00';
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));
}
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ' + score, 10, 30);
}
function showMessage(msg) {
  ctx.font = '28px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(msg, 60, 240);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawCoins();
  drawObstacles();
  drawEnemies();
  drawScore();
  if (gameOver) {
    showMessage('Game Over! Tap to restart');
    canvas.addEventListener('touchstart', restart, { once: true });
    return;
  }
  // Player physics
  player.vy += gravity;
  player.y += player.vy;
  if (player.y + player.h > 420) {
    player.y = 420 - player.h;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }
  // Scroll objects
  coins.forEach(c => c.x -= scrollSpeed);
  obstacles.forEach(o => o.x -= scrollSpeed);
  enemies.forEach(e => e.x -= scrollSpeed);
  // Collisions
  coins.forEach((c, i) => {
    if (Math.abs(player.x + player.w/2 - c.x) < c.r + player.w/2 && Math.abs(player.y + player.h/2 - c.y) < c.r + player.h/2) {
      score++;
      coins.splice(i, 1);
    }
  });
  obstacles.forEach(o => {
    if (player.x < o.x + o.w && player.x + player.w > o.x && player.y < o.y + o.h && player.y + player.h > o.y) {
      gameOver = true;
    }
  });
  enemies.forEach(e => {
    if (player.x < e.x + e.w && player.x + player.w > e.x && player.y < e.y + e.h && player.y + player.h > e.y) {
      gameOver = true;
    }
  });
  // Remove off-screen
  coins = coins.filter(c => c.x + c.r > 0);
  obstacles = obstacles.filter(o => o.x + o.w > 0);
  enemies = enemies.filter(e => e.x + e.w > 0);
  // Spawn
  if (Math.random() < 0.03) spawnCoin();
  if (Math.random() < 0.02) spawnObstacle();
  if (Math.random() < 0.01) spawnEnemy();
  requestAnimationFrame(update);
}
function restart() {
  player = { x: 60, y: 380, w: 32, h: 32, vy: 0, onGround: false };
  coins = [];
  obstacles = [];
  enemies = [];
  score = 0;
  gameOver = false;
  update();
}
update();
