
const canvas = document.getElementById('spaceShooterCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let ship = { x: canvas.width / 2 - 15, y: canvas.height - 50, w: 30, h: 30 };
let bullets = [];
let enemies = [{ x: 50, y: 40, w: 30, h: 30 }];

canvas.addEventListener('touchstart', function(e) {
	const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
	ship.x = touchX - ship.w / 2;
	bullets.push({ x: ship.x + ship.w / 2 - 3, y: ship.y, w: 6, h: 12 });
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

	// Move bullets
	bullets.forEach(b => b.y -= 6);
	bullets = bullets.filter(b => b.y + b.h > 0);

	// Simple enemy movement
	enemies.forEach(e => e.x += 2 * (Math.random() > 0.5 ? 1 : -1));

	// Collision
	bullets.forEach(b => {
		enemies.forEach((e, ei) => {
			if (
				b.x < e.x + e.w && b.x + b.w > e.x &&
				b.y < e.y + e.h && b.y + b.h > e.y
			) {
				enemies.splice(ei, 1);
			}
		});
	});

	// Respawn enemy if none
	if (enemies.length === 0) enemies.push({ x: Math.random() * (canvas.width - 30), y: 40, w: 30, h: 30 });

	requestAnimationFrame(update);
}

update();