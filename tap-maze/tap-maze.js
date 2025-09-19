// Tap Maze MVP
const canvas = document.getElementById('tapMazeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let player = { x: 40, y: 40, r: 18 };
let goal = { x: 260, y: 420, r: 22 };
let walls = [
  { x: 80, y: 0, w: 20, h: 400 },
  { x: 160, y: 80, w: 20, h: 400 },
  { x: 240, y: 0, w: 20, h: 400 }
];
let gameOver = false;
canvas.addEventListener('touchstart', function(e) {
  if (gameOver) return;
  const x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  const y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  if (x > player.x) player.x += 40;
  else player.x -= 40;
  if (y > player.y) player.y += 40;
  else player.y -= 40;
  // Wall collision
  for (let wall of walls) {
    if (player.x + player.r > wall.x && player.x - player.r < wall.x + wall.w && player.y + player.r > wall.y && player.y - player.r < wall.y + wall.h) {
      gameOver = true;
    }
  }
  // Win
  if (Math.hypot(player.x - goal.x, player.y - goal.y) < player.r + goal.r) {
    gameOver = true;
  }
});
function drawMaze() {
  ctx.fillStyle = '#888';
  walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));
}
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI*2);
  ctx.fillStyle = '#0f0';
  ctx.fill();
  ctx.closePath();
}
function drawGoal() {
  ctx.beginPath();
  ctx.arc(goal.x, goal.y, goal.r, 0, Math.PI*2);
  ctx.fillStyle = '#ffd700';
  ctx.fill();
  ctx.closePath();
}
function showMessage(msg) {
  ctx.font = '24px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(msg, 60, 240);
}
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPlayer();
  drawGoal();
  if (gameOver) {
    if (Math.hypot(player.x - goal.x, player.y - goal.y) < player.r + goal.r) showMessage('You Win!');
    else showMessage('Game Over!');
    return;
  }
  requestAnimationFrame(update);
}
update();
