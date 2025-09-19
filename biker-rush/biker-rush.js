// Biker Rush MVP
const canvas = document.getElementById('bikerRushCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let biker = { x: 140, y: 400, w: 40, h: 60 };
let cars = [];
let score = 0;
let gameOver = false;

function spawnCar() {
  const lane = Math.floor(Math.random() * 3);
  cars.push({ x: lane * 100 + 10, y: -60, w: 80, h: 60, color: ['#f00','#ff0','#0ff'][lane] });
}

canvas.addEventListener('touchstart', function(e) {
  if (gameOver) return;
  const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  if (touchX < canvas.width / 2 && biker.x > 10) biker.x -= 100;
  else if (touchX > canvas.width / 2 && biker.x < 210) biker.x += 100;
});

function drawRoad() {
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 100, 0);
    ctx.lineTo(i * 100, canvas.height);
    ctx.stroke();
  }
}

function drawBiker() {
  ctx.fillStyle = '#0f0';
  ctx.fillRect(biker.x, biker.y, biker.w, biker.h);
}

function drawCars() {
  cars.forEach(car => {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.w, car.h);
  });
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
  drawRoad();
  drawBiker();
  drawCars();
  drawScore();
  if (gameOver) {
    showMessage('Game Over! Tap to restart');
    canvas.addEventListener('touchstart', restart, { once: true });
    return;
  }
  cars.forEach(car => {
    car.y += 6;
    // Collision
    if (
      biker.x < car.x + car.w && biker.x + biker.w > car.x &&
      biker.y < car.y + car.h && biker.y + biker.h > car.y
    ) {
      gameOver = true;
    }
  });
  cars = cars.filter(car => car.y < canvas.height);
  score++;
  if (Math.random() < 0.04) spawnCar();
  requestAnimationFrame(update);
}

function restart() {
  biker = { x: 140, y: 400, w: 40, h: 60 };
  cars = [];
  score = 0;
  gameOver = false;
  update();
}

update();
