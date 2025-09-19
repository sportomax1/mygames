// Whack-a-Mole MVP
const canvas = document.getElementById('whackMoleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let moles = [];
let score = 0;
let gameOver = false;

function spawnMole() {
  const x = Math.floor(Math.random() * 3) * 100 + 30;
  const y = Math.floor(Math.random() * 3) * 120 + 60;
  moles.push({ x, y, r: 30, t: Date.now() });
}
canvas.addEventListener('touchstart', function(e) {
  if (gameOver) return;
  const x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  const y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  moles.forEach((mole, i) => {
    if (Math.hypot(mole.x - x, mole.y - y) < mole.r) {
      score++;
      moles.splice(i, 1);
    }
  });
});
function drawMoles() {
  moles.forEach(mole => {
    ctx.beginPath();
    ctx.arc(mole.x, mole.y, mole.r, 0, Math.PI*2);
    ctx.fillStyle = '#a0522d';
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
  drawMoles();
  drawScore();
  moles = moles.filter(mole => Date.now() - mole.t < 1200);
  if (Math.random() < 0.03) spawnMole();
  requestAnimationFrame(update);
}
update();
