// Minimal Flappy Bird MVP
const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let bird = { x: 60, y: 240, r: 16, vy: 0 };
let pipes = [];
let frame = 0;
let gameOver = false;
let score = 0;
let scoredPipe = 0;

canvas.addEventListener('touchstart', function() {
  if (gameOver) {
    // Only restart if tap is in center area
    let touchY = event.touches[0].clientY - canvas.getBoundingClientRect().top;
    if (touchY > 200 && touchY < 300) {
      restart();
    }
    return;
  }
  bird.vy = -6;
});

function drawBird() {
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
  ctx.fillStyle = '#ff0';
  ctx.fill();
  ctx.closePath();
}
function drawPipes() {
  ctx.fillStyle = '#0f0';
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, p.w, p.top);
    ctx.fillRect(p.x, p.top + p.gap, p.w, canvas.height - p.top - p.gap);
  });
}
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  ctx.font = '20px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ' + score, 10, 30);
  if (gameOver) {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Game Over!', 90, 240);
    ctx.font = '18px Arial';
    ctx.fillText('Tap to restart', 100, 270);
    return;
  }
  bird.vy += 0.5;
  bird.y += bird.vy;
  if (bird.y + bird.r > canvas.height || bird.y - bird.r < 0) gameOver = true;
  if (frame % 90 === 0) {
    let top = Math.random() * 200 + 40;
    pipes.push({ x: canvas.width, w: 40, top, gap: 100, scored: false });
  }
  pipes.forEach(p => {
    p.x -= 3;
    // Collision
    if (
      bird.x + bird.r > p.x && bird.x - bird.r < p.x + p.w &&
      (bird.y - bird.r < p.top || bird.y + bird.r > p.top + p.gap)
    ) {
      gameOver = true;
    }
    // Scoring
    if (!p.scored && p.x + p.w < bird.x - bird.r) {
      score++;
      p.scored = true;
    }
  });
  pipes = pipes.filter(p => p.x + p.w > 0);
  frame++;
  requestAnimationFrame(update);
function restart() {
  bird = { x: 60, y: 240, r: 16, vy: 0 };
  pipes = [];
  frame = 0;
  gameOver = false;
  score = 0;
  scoredPipe = 0;
}
}
update();
