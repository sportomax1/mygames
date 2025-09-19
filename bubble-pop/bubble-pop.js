// Bubble Pop MVP
const canvas = document.getElementById('bubblePopCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let bubbles = [];
let score = 0;
canvas.addEventListener('touchstart', function(e) {
  const x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  const y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  bubbles.forEach((b, i) => {
    if (Math.hypot(b.x - x, b.y - y) < b.r) {
      score++;
      bubbles.splice(i, 1);
    }
  });
});
function spawnBubble() {
  const x = Math.random() * (canvas.width - 40) + 20;
  const y = canvas.height + 20;
  const r = Math.random() * 20 + 20;
  bubbles.push({ x, y, r, vy: -2 - Math.random()*2 });
}
function drawBubbles() {
  bubbles.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.fillStyle = '#0ff';
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;
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
  drawBubbles();
  drawScore();
  bubbles.forEach(b => b.y += b.vy);
  bubbles = bubbles.filter(b => b.y + b.r > 0);
  if (Math.random() < 0.04) spawnBubble();
  requestAnimationFrame(update);
}
update();
