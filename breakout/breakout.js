
const canvas = document.getElementById('breakoutCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let paddle = { w: 60, h: 10, x: 130 };
let ball = { x: 160, y: 300, r: 8, dx: 4, dy: -4 };
let bricks = [];
let rows = 3, cols = 6, brickW = 40, brickH = 16;
for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		bricks.push({ x: c * (brickW + 4) + 10, y: r * (brickH + 4) + 30, w: brickW, h: brickH, hit: false });
	}
}

let draggingPaddle = false;
canvas.addEventListener('touchstart', function(e) {
	draggingPaddle = true;
	const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
	paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, touchX - paddle.w / 2));
});

canvas.addEventListener('touchmove', function(e) {
	if (!draggingPaddle) return;
	const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
	paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, touchX - paddle.w / 2));
});

canvas.addEventListener('touchend', function(e) {
	draggingPaddle = false;
});

function drawPaddle() {
	ctx.fillStyle = '#f00';
	ctx.fillRect(paddle.x, canvas.height - paddle.h - 10, paddle.w, paddle.h);
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
	ctx.fillStyle = '#fff';
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	bricks.forEach(b => {
		if (!b.hit) {
			ctx.fillStyle = '#0f0';
			ctx.fillRect(b.x, b.y, b.w, b.h);
		}
	});
}

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPaddle();
	drawBall();
	drawBricks();

	// Ball movement
	ball.x += ball.dx;
	ball.y += ball.dy;

	// Wall collision
	if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.dx = -ball.dx;
	if (ball.y - ball.r < 0) ball.dy = -ball.dy;

	// Paddle collision
	if (
		ball.y + ball.r > canvas.height - paddle.h - 10 &&
		ball.x > paddle.x && ball.x < paddle.x + paddle.w
	) {
		ball.dy = -ball.dy;
	}

	// Missed paddle
	if (ball.y + ball.r > canvas.height) {
		ball.x = 160; ball.y = 300; ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1); ball.dy = -4;
	}

	// Brick collision
	bricks.forEach(b => {
		if (!b.hit &&
			ball.x > b.x && ball.x < b.x + b.w &&
			ball.y - ball.r < b.y + b.h && ball.y + ball.r > b.y
		) {
			ball.dy = -ball.dy;
			b.hit = true;
		}
	});

	// Win condition
	if (bricks.every(b => b.hit)) {
		setTimeout(() => alert('You win!'), 100);
		bricks.forEach(b => b.hit = false);
	}

	requestAnimationFrame(update);
}

update();