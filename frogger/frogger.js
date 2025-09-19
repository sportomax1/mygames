
const canvas = document.getElementById('froggerCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let frog = { x: 150, y: 440, w: 20, h: 20 };
let carColors = ['#f00', '#ff0', '#0ff', '#f0f', '#0f0'];
let cars = [
  { x: 0, y: 400, w: 60, h: 20, dx: 2, color: carColors[0] },
  { x: 320, y: 360, w: 60, h: 20, dx: -2, color: carColors[1] },
  { x: 0, y: 320, w: 60, h: 20, dx: 3, color: carColors[2] }
];
let logs = [
  { x: 0, y: 160, w: 80, h: 20, dx: 1.5 },
  { x: 320, y: 120, w: 80, h: 20, dx: -1.5 }
];
let gameOver = false;
let win = false;

canvas.addEventListener('touchstart', function(e) {
  if (gameOver || win) return;
  const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  if (touchY < frog.y) frog.y -= 40;
  else if (touchY > frog.y) frog.y += 40;
  else if (touchX < frog.x) frog.x -= 40;
  else frog.x += 40;
});

function drawLaneMarkers() {
  for (let y = 400; y >= 320; y -= 40) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, y + 10);
      ctx.lineTo(x + 20, y + 10);
      ctx.stroke();
    }
  }
}

function drawWater() {
  ctx.fillStyle = '#00bcd4';
  ctx.fillRect(0, 80, canvas.width, 120);
}

function drawLogs() {
  logs.forEach(log => {
    ctx.fillStyle = '#a0522d';
    ctx.fillRect(log.x, log.y, log.w, log.h);
  });
}

function drawFrog() {
  ctx.fillStyle = '#0f0';
  ctx.fillRect(frog.x, frog.y, frog.w, frog.h);
}

function drawCars() {
  cars.forEach(car => {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.w, car.h);
  });
}

function showMessage(msg) {
  ctx.font = '24px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(msg, 80, 240);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLaneMarkers();
  drawWater();
  drawLogs();
  drawFrog();
  drawCars();

  // Move cars
  cars.forEach(car => {
    car.x += car.dx;
    if (car.x > canvas.width) car.x = -car.w;
    if (car.x + car.w < 0) car.x = canvas.width;
    // Collision
    if (
      frog.x < car.x + car.w && frog.x + frog.w > car.x &&
      frog.y < car.y + car.h && frog.y + frog.h > car.y
    ) {
      gameOver = true;
    }
  });

  // Move logs
  logs.forEach(log => {
    log.x += log.dx;
    if (log.x > canvas.width) log.x = -log.w;
    if (log.x + log.w < 0) log.x = canvas.width;
  });

  // Water collision
  if (frog.y < 200 && frog.y >= 80) {
    let onLog = logs.some(log =>
      frog.x + frog.w > log.x && frog.x < log.x + log.w &&
      frog.y + frog.h > log.y && frog.y < log.y + log.h
    );
    if (!onLog) gameOver = true;
    else {
      // Move frog with log
      logs.forEach(log => {
        if (
          frog.x + frog.w > log.x && frog.x < log.x + log.w &&
          frog.y + frog.h > log.y && frog.y < log.y + log.h
        ) {
          frog.x += log.dx;
        }
      });
    }
  }

  // Win condition
  if (frog.y < 40) {
    win = true;
  }

  if (gameOver) {
    showMessage('You Died! Tap to restart');
    canvas.addEventListener('touchstart', restart, { once: true });
    return;
  }
  if (win) {
    showMessage('You Win! Tap to play again');
    canvas.addEventListener('touchstart', restart, { once: true });
    return;
  }
  requestAnimationFrame(update);
}

function restart() {
  frog = { x: 150, y: 440, w: 20, h: 20 };
  gameOver = false;
  win = false;
  update();
}

update();
