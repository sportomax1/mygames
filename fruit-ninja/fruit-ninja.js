// Minimal Fruit Ninja MVP
const canvas = document.getElementById('fruitNinjaCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let fruits = [];
let score = 0;
let slicing = false;
let lastX = 0, lastY = 0;

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
  if (Math.random() < 0.03) spawnFruit();
  requestAnimationFrame(update);
}
update();
