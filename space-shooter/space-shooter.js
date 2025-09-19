

const canvas = document.getElementById('spaceShooterCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let ship = { x: canvas.width / 2 - 15, y: canvas.height - 50, w: 30, h: 30 };
let bullets = [];
let enemies = [{ x: 50, y: 0, w: 30, h: 30, speed: 2 }];
let lastTap = 0;
let score = 0;

let draggingShip = false;
canvas.addEventListener('touchstart', function(e) {
	draggingShip = true;
	const now = Date.now();
	const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
	ship.x = Math.max(0, Math.min(canvas.width - ship.w, touchX - ship.w / 2));
	// Double tap to shoot
	if (now - lastTap < 300) {
		bullets.push({ x: ship.x + ship.w / 2 - 3, y: ship.y, w: 6, h: 12 });
	}
	lastTap = now;
});
canvas.addEventListener('touchmove', function(e) {
	if (!draggingShip) return;
	const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
	ship.x = Math.max(0, Math.min(canvas.width - ship.w, touchX - ship.w / 2));
});
canvas.addEventListener('touchend', function(e) {
	draggingShip = false;
});

function drawShip() {
	ctx.fillStyle = '#0ff';
	ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
}

function drawBullets() {
	ctx.fillStyle = '#fff';
	bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
}

function drawEnemies() {
	ctx.fillStyle = '#f00';
	enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));
}

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawShip();
	drawBullets();
	drawEnemies();
	ctx.font = '20px Arial';
	ctx.fillStyle = '#fff';
	ctx.fillText('Score: ' + score, 10, 30);

	// Move bullets
	bullets.forEach(b => b.y -= 6);
	bullets = bullets.filter(b => b.y + b.h > 0);

	// Enemy movement: move top to bottom
	enemies.forEach(e => {
		e.y += e.speed;
	});
	enemies = enemies.filter(e => e.y < canvas.height);

	// Collision
	bullets.forEach(b => {
		enemies.forEach((e, ei) => {
			if (
				b.x < e.x + e.w && b.x + b.w > e.x &&
				b.y < e.y + e.h && b.y + b.h > e.y
			) {
				enemies.splice(ei, 1);
				score++;
			}
		});
	});

	// Respawn enemy if none
	if (enemies.length === 0) {
		let speed = 2 + Math.random() * 3;
		enemies.push({ x: Math.random() * (canvas.width - 30), y: 0, w: 30, h: 30, speed });
	}

	requestAnimationFrame(update);
}

update();