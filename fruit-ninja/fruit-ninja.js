// Minimal Fruit Ninja MVP
const canvas = document.getElementById('fruitNinjaCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let fruits = [];
let score = 0;
let slicing = false;
let lastX = 0, lastY = 0;
let slices = [];

function spawnFruit() {
  const x = Math.random() * (canvas.width - 40) + 20;
  const y = canvas.height + 20;
  const color = ['#f00','#ff0','#0f0','#0ff','#f0f'][Math.floor(Math.random()*5)];
  fruits.push({ x, y, r: 20, vy: -6 - Math.random()*2, vx: (Math.random()-0.5)*4, color });
}

canvas.addEventListener('touchstart', function(e) {
  slicing = true;
  lastX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  lastY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
});
canvas.addEventListener('touchmove', function(e) {
  if (!slicing) return;
  const x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  const y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  fruits.forEach((fruit, i) => {
    if (Math.hypot(fruit.x - x, fruit.y - y) < fruit.r) {
      score++;
      // Add slice animation
      slices.push({ x: fruit.x, y: fruit.y, angle: Math.atan2(y-lastY, x-lastX), t: 0, color: fruit.color });
      fruits.splice(i, 1);
    }
  });
  lastX = x;
  lastY = y;
});
canvas.addEventListener('touchend', function() {
  slicing = false;
});

function drawFruits() {
  fruits.forEach(fruit => {
    ctx.beginPath();
    ctx.arc(fruit.x, fruit.y, fruit.r, 0, Math.PI*2);
    ctx.fillStyle = fruit.color;
    ctx.fill();
    ctx.closePath();
  });
  // Draw slice animations
  slices.forEach(slice => {
    ctx.save();
    ctx.translate(slice.x, slice.y);
    ctx.rotate(slice.angle);
    ctx.beginPath();
    ctx.arc(0, 0, 28 + slice.t*8, -0.4, 0.4);
    ctx.lineWidth = 6 - slice.t*2;
    ctx.strokeStyle = slice.color;
    ctx.globalAlpha = 0.7 - slice.t*0.7;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
    // Burst effect
    if (slice.t < 0.2) {
      ctx.save();
      ctx.translate(slice.x, slice.y);
      ctx.rotate(slice.angle);
      ctx.beginPath();
      ctx.arc(0, 0, 10 + slice.t*20, 0, Math.PI*2);
      ctx.fillStyle = slice.color;
      ctx.globalAlpha = 0.3 - slice.t*0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  });
}

function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ' + score, 10, 30);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFruits();
  drawScore();
  fruits.forEach(fruit => {
    fruit.x += fruit.vx;
    fruit.y += fruit.vy;
    fruit.vy += 0.2;
  });
  fruits = fruits.filter(fruit => fruit.y - fruit.r < canvas.height);
  // Animate slices
  slices.forEach(slice => { slice.t += 0.04; });
  slices = slices.filter(slice => slice.t < 1);
  if (Math.random() < 0.03) spawnFruit();
  requestAnimationFrame(update);
}
update();
