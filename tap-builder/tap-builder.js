// Tap Builder MVP
const canvas = document.getElementById('tapBuilderCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let buildings = [];
let score = 0;
canvas.addEventListener('touchstart', function(e) {
  const x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  const y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  buildings.push({ x, y, w: 40, h: 40 });
  score++;
});
function drawBuildings() {
  buildings.forEach(b => {
    ctx.fillStyle = '#00bcd4';
    ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
  });
}
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ' + score, 10, 30);
}
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBuildings();
  drawScore();
  requestAnimationFrame(update);
}
update();
