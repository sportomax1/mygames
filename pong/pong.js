
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let paddleWidth = 60, paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballRadius = 8;
let ballDX = 2, ballDY = -2;
let rightPressed = false, leftPressed = false;

document.addEventListener('touchstart', function(e) {
	const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
	if (touchX > paddleX + paddleWidth / 2) rightPressed = true;
	else leftPressed = true;
});
document.addEventListener('touchend', function() {
	rightPressed = false;
	leftPressed = false;
});

function drawPaddle() {
	ctx.fillStyle = '#0f0';
	ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = '#fff';
	ctx.fill();
	ctx.closePath();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPaddle();
	drawBall();

	// Ball movement
	ballX += ballDX;
	ballY += ballDY;

	// Wall collision
	if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) ballDX = -ballDX;
	if (ballY - ballRadius < 0) ballDY = -ballDY;

	// Paddle collision
	if (
		ballY + ballRadius > canvas.height - paddleHeight - 10 &&
		ballX > paddleX && ballX < paddleX + paddleWidth
	) {
		ballDY = -ballDY;
	}

	// Missed paddle
	if (ballY + ballRadius > canvas.height) {
		ballX = canvas.width / 2;
		ballY = canvas.height / 2;
		ballDX = 2 * (Math.random() > 0.5 ? 1 : -1);
		ballDY = -2;
	}

	// Paddle movement
	if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
	if (leftPressed && paddleX > 0) paddleX -= 5;

	requestAnimationFrame(draw);
}

draw();